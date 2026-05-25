/**
 * venice-transport.js
 * ALL Venice-specific navigation logic for A Perfect Day.
 *
 * 1. Route LINE drawing (_fetchOSRMRoute override)
 *    - Splits saved places into consecutive walk groups and boat crossings.
 *    - Walk groups: routed via OSRM foot (real Venice street paths).
 *    - Boat crossings: drawn as straight lines across the lagoon.
 *
 * 2. Route STATS (_fetchRouteStats override)
 *    - Replaces walking times with accurate ACTV vaporetto times for
 *      any leg that crosses between island groups.
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

  /**
   * Sum of haversine distances along a coordinate array [[lng,lat], ...].
   * Used to detect ferry-inflated OSRM routes.
   */
  function _routeLength(coords) {
    var total = 0;
    for (var i = 1; i < coords.length; i++) {
      total += crow(
        { lat: coords[i - 1][1], lng: coords[i - 1][0] },
        { lat: coords[i][1],     lng: coords[i][0]     }
      );
    }
    return total;
  }

  // ── 1. Route LINE drawing override ───────────────────────────────────────
  // Splits places into walk groups (consecutive main-island stops) and boat
  // crossings (to/from murano, burano, torcello).
  //   - Walk groups: sent to OSRM for real Venice street paths.
  //     If OSRM returns a route more than 4× the direct crow-fly distance
  //     (a sign it used Venice's ferry links instead of the actual calli),
  //     the result is rejected and a straight line is drawn instead.
  //   - Boat crossings: drawn as a straight line across the lagoon.

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
      if (_origFetchOSRM) {
        try {
          var raw = await _origFetchOSRM(group);
          if (raw && raw.length > 1) {
            // Reject ferry-inflated routes: OSRM foot profile includes Venice
            // vaporetto lines as valid foot paths, producing wild detours.
            // Real Venice walking routes through the calli are ≤ ~3× crow-fly;
            // ferry-routed paths are typically 5–10×.
            var directM = 0;
            for (var g = 1; g < group.length; g++) {
              directM += crow(group[g - 1], group[g]);
            }
            if (directM === 0 || _routeLength(raw) <= directM * 4.0) {
              coords = raw;
            }
          }
        } catch (e) {}
      }
      // Fallback: straight lines between the places
      if (!coords) {
        coords = group.map(function (p) { return [p.lng, p.lat]; });
      }

      if (result.length > 0 && coords.length > 0) coords = coords.slice(1);
      result.push.apply(result, coords);
    }

    for (var i = 0; i < places.length - 1; i++) {
      if (legKey(places[i], places[i + 1]) !== null) {
        // End of a walk group — route it, then add the boat destination as a straight-line point
        await routeWalkGroup(places.slice(groupStart, i + 1));
        result.push([places[i + 1].lng, places[i + 1].lat]);
        groupStart = i + 1;
      }
    }

    // Route the final (or only) walk group
    await routeWalkGroup(places.slice(groupStart));
    return result;
  };

  // ── 2. Route STATS override ───────────────────────────────────────────────

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
      if (bar) bar.textContent = '\u26f5 ' + fmt(totalMins);
      legs.forEach(function (leg, i) {
        var el = document.getElementById('saved-conn-' + i);
        if (!el) return;
        el.textContent = leg.mode === 'boat'
          ? '\u2193 ~' + leg.mins + ' min by vaporetto \u26f5'
          : '\u2193 ~' + leg.mins + ' min walk';
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