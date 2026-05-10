/**
 * venice-transport.js
 * Venice-specific transport override for A Perfect Day.
 *
 * Replaces the shared OSRM walking/driving route stats with vaporetto
 * (water bus) times whenever a saved-places itinerary leg crosses water.
 *
 * Island groups:
 *   murano   — Murano island (lines 4.1, 4.2)
 *   burano   — Burano island (line 12)
 *   torcello — Torcello island (line 9 from Burano)
 *   main     — Venice main island + Giudecca (all other nbhd values)
 *
 * Times are ACTV approximate sailing times with a 20% buffer for
 * boarding, disembarking, and waiting at the stop.
 *
 * Legs entirely within the main island fall back to the shared OSRM
 * walking route calculation as normal.
 *
 * Load order: after ui-favourites.js, before </body>.
 */

(function () {
  'use strict';

  // ── Configuration ────────────────────────────────────────────────────────

  var BOAT_BUFFER = 1.20; // +20 % for boarding/waiting/disembarking

  var BOAT_ISLANDS = ['murano', 'burano', 'torcello'];

  /** Base sailing minutes between island groups (ACTV timetable). */
  var BASE_MINS = {
    'main:murano':      12,   // Line 4.1 / 4.2 from Fondamente Nove
    'burano:main':      45,   // Line 12  from Fondamente Nove
    'main:torcello':    50,   // Line 12 to Burano + Line 9
    'murano:burano':    35,   // Line 12 from Murano Faro
    'murano:torcello':  40,   // Line 12 + Line 9
    'burano:torcello':   5,   // Line 9
  };

  /** Approximate crow-fly distances over water in metres. */
  var BOAT_DIST = {
    'main:murano':    1500,
    'burano:main':    8500,
    'main:torcello':  9500,
    'murano:burano':  8000,
    'murano:torcello':9000,
    'burano:torcello':1500,
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
    var g1 = grp(p1.nbhd);
    var g2 = grp(p2.nbhd);
    if (g1 === g2) return null;
    return [g1, g2].sort().join(':');
  }

  /** Haversine crow-fly distance in metres. Uses shared function if available. */
  function crow(p1, p2) {
    if (typeof haversineM === 'function') return haversineM(p1, p2);
    var R   = 6371000;
    var dLat = (p2.lat - p1.lat) * Math.PI / 180;
    var dLng = (p2.lng - p1.lng) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180)
          * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  /** Format minutes → "~14m" or "~1h 2m". */
  function fmt(m) {
    if (m < 60) return '~' + m + 'm';
    var h = Math.floor(m / 60);
    var r = m % 60;
    return '~' + h + 'h' + (r ? ' ' + r + 'm' : '');
  }

  /** Boat minutes for a given route key, with buffer applied. */
  function boatMins(key) {
    return Math.round((BASE_MINS[key] || 30) * BOAT_BUFFER);
  }

  // ── _fetchRouteStats override ─────────────────────────────────────────────

  var _origFetch = window._fetchRouteStats;

  window._fetchRouteStats = function (places) {

    // Classify every consecutive leg
    var keys = places.slice(1).map(function (p, i) {
      return legKey(places[i], p);
    });

    // No water crossings — hand off to OSRM as normal
    if (!keys.some(Boolean)) {
      return _origFetch ? _origFetch(places) : Promise.reject('no-osrm');
    }

    // Build per-leg stats: boat legs use pre-defined times, walking legs
    // use haversine-based estimate (OSRM per-leg is not worth the complexity).
    var legs = places.slice(1).map(function (p, i) {
      var k = keys[i];
      if (k) {
        return {
          mins: boatMins(k),
          distM: BOAT_DIST[k] || 5000,
          mode: 'boat',
        };
      }
      var d = crow(places[i], p);
      return {
        mins: Math.max(5, Math.round(d * 1.35 / 50)),
        distM: d,
        mode: 'walk',
      };
    });

    var totalMins = legs.reduce(function (s, l) { return s + l.mins; }, 0);
    var totalDist = legs.reduce(function (s, l) { return s + l.distM; }, 0);

    // After renderList has built the connector elements, overwrite them
    // with the correct mode-specific labels.
    setTimeout(function () {

      // Stats bar total
      var bar = document.getElementById('saved-stat-walk-sheet');
      if (bar) bar.textContent = '⛵ ' + fmt(totalMins);

      // Per-leg connectors
      legs.forEach(function (leg, i) {
        var el = document.getElementById('saved-conn-' + i);
        if (!el) return;
        el.textContent = leg.mode === 'boat'
          ? '↓ ~' + leg.mins + ' min by vaporetto ⛵'
          : '↓ ~' + leg.mins + ' min walk';
      });

    }, 150);

    return Promise.resolve({
      walkMins:  totalMins,
      distM:     totalDist,
      legMins:   legs.map(function (l) { return l.mins; }),
      legModes:  legs.map(function (l) { return l.mode; }),
      travelMode: 'boat',
    });
  };

}());
