/**
 * venice-transport.js
 * ALL Venice-specific navigation logic for A Perfect Day.
 *
 * 1. Route LINE drawing (_fetchOSRMRoute override)
 *    - Splits saved places into walk groups and boat crossings.
 *    - Walk groups: routed via Valhalla (use_ferry:0) so ferry links in OSM
 *      are excluded from pedestrian routing. Falls back to OSRM if Valhalla
 *      is unreachable, then to straight lines.
 *    - Boat crossings (to murano / burano / torcello): straight lines.
 *
 * 2. Route STATS (_fetchRouteStats override)
 *    - Replaces walking times with accurate ACTV vaporetto times for any
 *      leg that crosses between island groups.
 *    - Legs entirely within the main island use the original OSRM stats.
 *
 * Island groups:
 *   murano   — Murano island (lines 4.1, 4.2)
 *   burano   — Burano island (line 12)
 *   torcello — Torcello island (line 9 from Burano)
 *   main     — Venice main island + Giudecca (all other nbhd values)
 *
 * Load order: after ui-favourites.js, before </body>.
 */

(function () {
  'use strict';

  // ── Configuration ────────────────────────────────────────────────────────

  var BOAT_BUFFER  = 1.20; // +20 % for boarding/waiting/disembarking
  var BOAT_ISLANDS = ['murano', 'burano', 'torcello'];

  /** Base sailing minutes between island groups (ACTV timetable). */
  var BASE_MINS = {
    'main:murano':     12,   // Line 4.1 / 4.2 from Fondamente Nove
    'burano:main':     45,   // Line 12 from Fondamente Nove
    'main:torcello':   50,   // Line 12 to Burano + Line 9
    'murano:burano':   35,   // Line 12 from Murano Faro
    'murano:torcello': 40,   // Line 12 + Line 9
    'burano:torcello':  5,   // Line 9
  };

  /** Approximate crow-fly distances over water in metres. */
  var BOAT_DIST = {
    'main:murano':     1500,
    'burano:main':     8500,
    'main:torcello':   9500,
    'murano:burano':   8000,
    'murano:torcello': 9000,
    'burano:torcello': 1500,
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Classify a place's neighbourhood into an island group. */
  function grp(nbhd) {
    return BOAT_ISLANDS.indexOf(nbhd) >= 0 ? nbhd : 'main';
  }

  /**
   * Return the canonical route key for two places, or null if they
   * are in the same island group (no boat needed).
   */
  function legKey(p1, p2) {
    var g1 = grp(p1.nbhd), g2 = grp(p2.nbhd);
    if (g1 === g2) return null;
    return [g1, g2].sort().join(':');
  }

  /** Haversine crow-fly distance in metres. */
  function crow(p1, p2) {
    var R = 6371000, toR = Math.PI / 180;
    var dLat = (p2.lat - p1.lat) * toR, dLng = (p2.lng - p1.lng) * toR;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2)
          + Math.cos(p1.lat * toR) * Math.cos(p2.lat * toR)
          * Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /** Format minutes → "~14m" or "~1h 2m". */
  function fmt(m) {
    if (m < 60) return '~' + m + 'm';
    var h = Math.floor(m / 60), r = m % 60;
    return '~' + h + 'h' + (r ? ' ' + r + 'm' : '');
  }

  /** Boat minutes for a given route key, with buffer applied. */
  function boatMins(key) {
    return Math.round((BASE_MINS[key] || 30) * BOAT_BUFFER);
  }

  // ── Valhalla polyline6 decoder ────────────────────────────────────────────
  // Valhalla returns route shapes as polyline6-encoded strings (precision 1e6).
  // Output: array of [lng, lat] pairs for MapLibre GeoJSON.

  function _decodePolyline6(str) {
    var coords = [], index = 0, lat = 0, lng = 0;
    while (index < str.length) {
      var b, shift = 0, result = 0;
      do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      var dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0; result = 0;
      do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      var dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      coords.push([lng / 1e6, lat / 1e6]); // [lng, lat] for GeoJSON
    }
    return coords;
  }

  // ── Valhalla pedestrian routing (no ferries) ──────────────────────────────

  async function _fetchValhallaWalk(places) {
    var locs = places.map(function (p) { return { lon: p.lng, lat: p.lat }; });
    var body = JSON.stringify({
      locations: locs,
      costing: 'pedestrian',
      costing_options: { pedestrian: { use_ferry: 0 } },
      directions_type: 'none'
    });
    var res = await fetch('https://valhalla.openstreetmap.de/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return null;
    var data = await res.json();
    if (!data.trip || !data.trip.legs || !data.trip.legs.length) return null;
    var allCoords = [];
    data.trip.legs.forEach(function (leg, i) {
      var coords = _decodePolyline6(leg.shape);
      if (i > 0 && allCoords.length > 0) coords = coords.slice(1);
      allCoords.push.apply(allCoords, coords);
    });
    return allCoords.length > 1 ? allCoords : null;
  }

  // ── 1. Route LINE drawing override ───────────────────────────────────────

  var _origFetchOSRM = window._fetchOSRMRoute;

  window._fetchOSRMRoute = async function (places) {
    if (!places || places.length < 2) return [];

    var result     = [];
    var groupStart = 0;

    async function routeWalkGroup(group) {
      if (group.length === 0) return;
      if (group.length === 1) {
        if (result.length === 0) result.push([group[0].lng, group[0].lat]);
        return;
      }
      var coords = null;

      // 1st choice: Valhalla with use_ferry:0 — guaranteed ferry-free routing
      try {
        coords = await _fetchValhallaWalk(group);
      } catch (e) {}

      // 2nd choice: OSRM — may include ferry links but better than nothing
      if (!coords && _origFetchOSRM) {
        try {
          var raw = await _origFetchOSRM(group);
          if (raw && raw.length > 1) coords = raw;
        } catch (e) {}
      }

      // Last resort: straight lines
      if (!coords) coords = group.map(function (p) { return [p.lng, p.lat]; });
      if (result.length > 0 && coords.length > 0) coords = coords.slice(1);
      result.push.apply(result, coords);
    }

    for (var i = 0; i < places.length - 1; i++) {
      if (legKey(places[i], places[i + 1]) !== null) {
        await routeWalkGroup(places.slice(groupStart, i + 1));
        result.push([places[i + 1].lng, places[i + 1].lat]);
        groupStart = i + 1;
      }
    }
    await routeWalkGroup(places.slice(groupStart));
    return result;
  };

  // ── 2. Route STATS override ───────────────────────────────────────────────
  // Replaces walking times with accurate ACTV vaporetto times for any leg
  // that crosses between island groups.
  // Legs entirely within the main island are handed off to the original
  // OSRM-based stats function unchanged.

  var _origFetchStats = window._fetchRouteStats;

  window._fetchRouteStats = function (places) {

    var keys = places.slice(1).map(function (p, i) {
      return legKey(places[i], p);
    });

    // No water crossings — hand off to OSRM walking stats as normal
    if (!keys.some(Boolean)) {
      return _origFetchStats ? _origFetchStats(places) : Promise.reject('no-osrm');
    }

    // Mixed trip: use pre-defined boat times + haversine walk estimates
    var legs = places.slice(1).map(function (p, i) {
      var k = keys[i];
      if (k) {
        return { mins: boatMins(k), distM: BOAT_DIST[k] || 5000, mode: 'boat' };
      }
      var d = crow(places[i], p);
      return { mins: Math.max(5, Math.round(d * 1.35 / 50)), distM: d, mode: 'walk' };
    });

    var totalMins = legs.reduce(function (s, l) { return s + l.mins; }, 0);
    var totalDist = legs.reduce(function (s, l) { return s + l.distM; }, 0);

    // Update UI labels after the list has rendered
    setTimeout(function () {
      var bar = document.getElementById('saved-stat-walk-sheet');
      if (bar) bar.textContent = '⛵ ' + fmt(totalMins);
      legs.forEach(function (leg, i) {
        var el = document.getElementById('saved-conn-' + i);
        if (!el) return;
        el.textContent = leg.mode === 'boat'
          ? '↓ ~' + leg.mins + ' min by vaporetto ⛵'
          : '↓ ~' + leg.mins + ' min walk';
      });
    }, 150);

    return Promise.resolve({
      walkMins:   totalMins,
      distM:      totalDist,
      legMins:    legs.map(function (l) { return l.mins; }),
      legModes:   legs.map(function (l) { return l.mode; }),
      travelMode: 'boat',
    });
  };

}());
