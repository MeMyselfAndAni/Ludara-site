// A Perfect Day — [BLOGGER NAME] / [CITY]
// data.js — curated places
//
// ⚠️  DO NOT declare any of these in this file — they live elsewhere:
//       GUIDE_CITY    → map.js
//       BLOGGER_NAME  → map.js
//       FAVS_KEY      → ui-favourites.js
//       CC / CL       → map.js
//       map           → index.html (let map;)
//
// cat values must match keys in CC/CL in map.js:
//   landmark / food / cafe / pub / church / market / soviet / nature
//
// ⚠️  nbhd values must be PLAIN KEYS — e.g. 'sokolov', 'old-town'
//     NO 'nbhd-' prefix here or in map.js. The 'nbhd-' prefix belongs
//     only on HTML element IDs: id="nbhd-sokolov" in index.html.
//
// ─── CONTENT AUTHENTICITY RULES (enforce before every deploy) ────────────────
//
//   note field:  MUST be the blogger's exact published words. No paraphrasing,
//                no additions, no invented text. Copy directly from the source.
//                If the blogger hasn't written about a place, use a factual
//                description NOT attributed to them (no "— BloggerName" quote).
//
//   tip field:   MUST be the blogger's exact words, or left empty.
//                NEVER invent tips.
//
//   tip label:   Always "Visitor Tip" in index.html — never blogger's name.
//
//   Verification: Run the QA agent on every guide before approaching the blogger.
//
// ─── SOURCE VERIFICATION FORMAT ──────────────────────────────────────────────
//   // SOURCE: https://bloggersite.com/post-about-this-place/
//   // ✅ Verified exact words from source
//   or:
//   // ⚠️ No dedicated post — factual description, not attributed as blogger's words

const PLACES = [

  // ─── NEIGHBOURHOOD NAME ───────────────────────────────────────────────────

  {
    // SOURCE: https://bloggersite.com/post-about-this-place/
    id: 1,
    nbhd: 'key',                   // plain key — must match map.js NBHD_APPROX_CENTERS
    name: 'Place Name',
    cat: 'landmark',               // landmark/food/cafe/pub/church/market/soviet/nature
    emoji: '🏛️',
    address: 'Full address, Neighbourhood',
    lat: 0.0000,
    lng: 0.0000,
    search: 'Place Name City',     // used for Google Maps navigation
    note: "Blogger's exact published words — copied verbatim. Never invented.",
    hours: 'Daily 9am–6pm',
    tip: "Blogger's exact words, or empty string.",
    type: 'Type of Place',
    blog: 'https://bloggersite.com/post/',
    phone: '+1 234 567 8900',
    website: 'https://placename.com',
    // direct_image: 'https://...' // optional — used by fetch script if Wikimedia fails
  },

  {
    // ⚠️ No dedicated post — factual description, not attributed as blogger's words
    id: 2,
    nbhd: 'key-2',
    name: 'Another Place',
    cat: 'food',
    emoji: '🍽️',
    address: 'Full address, Neighbourhood 2',
    lat: 0.0000,
    lng: 0.0000,
    search: 'Another Place City',
    note: "Factual description from Google reviews or other verified source.",
    hours: 'Tue–Sun 1pm–10pm',
    tip: '',
    type: 'Restaurant',
    blog: '',
    phone: '',
    website: 'https://anotherplace.com',
  },

];
