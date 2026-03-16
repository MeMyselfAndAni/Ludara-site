// ── [GUIDE NAME] — PLACE DATA ─────────────────────────────────────────────────
// Instructions:
//   1. Fill in PLACES array — one object per place
//   2. Set FAVS_KEY to a unique string e.g. 'paris-favs', 'tokyo-favs'
//   3. Set BLOGGER_NAME and GUIDE_CITY
//   4. Update CC and CL if you need different category names/colours
//      — add any new categories to both CC and CL
//   5. Do NOT declare: map, markers, placesService, photoCache, renderList,
//      openDetail, or any function that lives in a platform file

const PLACES = [
  // {
  //   id: 1,                           // unique number — no gaps, no duplicates
  //   nbhd: "neighbourhood-id",        // must match a bubble id in index.html (without "nbhd-" prefix)
  //   name: "Place Name",
  //   cat: "landmark",                 // must exist in CC and CL below
  //   emoji: "🏛️",
  //   address: "Street, Area, City",
  //   lat: 0.0000, lng: 0.0000,        // GPS coordinates
  //   search: "Place Name City",       // used by fetch-images-wikimedia.js
  //   note: "Blogger's personal note about this place.",
  //   hours: "Mon–Fri 09:00–18:00",
  //   tip: "Insider tip from the blogger.",
  //   type: "Short type description",
  //   blog: "https://blogger.com/post",
  //   phone: "+1 234 567 8900",
  //   website: "https://place.com"
  // },
];

// ── GLOBALS — do not rename, used by all platform files ───────────────────────
let map, markers={}, placesService, AID=null, AF='all', ANF='all';

// ── CATEGORY COLOURS — add a new line for each new category ──────────────────
const CC = {
  landmark: '#e8724a',
  food:     '#f0c060',
  cafe:     '#6b9e6e',
  church:   '#6090c8',
  market:   '#c08060',
  pub:      '#9080a8',
  nature:   '#50906a',
};

// ── CATEGORY LABELS — must match CC keys exactly ──────────────────────────────
const CL = {
  landmark: 'Landmark & Sight',
  food:     'Restaurant',
  cafe:     'Café & Coffee',
  church:   'Church & Heritage',
  market:   'Market',
  pub:      'Pub & Bar',
  nature:   'Nature & Views',
};

// ── GUIDE IDENTITY — unique per guide ─────────────────────────────────────────
const FAVS_KEY     = 'CITYNAME-favs';   // ← REPLACE e.g. 'paris-favs'
const BLOGGER_NAME = 'Blogger Name';    // ← REPLACE e.g. 'Hand Luggage Only'
const GUIDE_CITY   = 'City Name';       // ← REPLACE e.g. 'London'
