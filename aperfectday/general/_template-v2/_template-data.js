// A Perfect Day — [BLOGGER NAME] / [CITY]
// data.js — curated places
//
// ⚠️  DO NOT declare any of these in this file — they live elsewhere:
//       GUIDE_CITY    → map.js
//       BLOGGER_NAME  → map.js
//       FAVS_KEY      → ui-favourites.js
//       CC            → map.js
//       CL            → map.js
//       map           → index.html (let map;)
//
// cat values must match keys in CC/CL in map.js:
//   landmark / food / cafe / pub / church / market / soviet / nature
//
// nbhd values must exactly match keys in NBHD_APPROX_CENTERS in map.js
// ⚠️  Use plain keys like 'sokolov', 'old-town' — NOT 'nbhd-sokolov' (no nbhd- prefix)
//
// ─── CONTENT AUTHENTICITY RULES (enforce before every deploy) ────────────────
//
//   note field:  MUST be the blogger's exact published words. No paraphrasing,
//                no additions, no invented text. Copy directly from the source.
//                If the blogger hasn't written about a place, use a factual
//                description NOT attributed to them (no "— BloggerName" quote).
//
//   tip field:   MUST be the blogger's exact words, or left empty.
//                NEVER invent tips. NEVER put invented content here.
//
//   tip label:   Always "Visitor Tip" in index.html — never blogger's name.
//                This prevents misattribution of invented or paraphrased content.
//
//   Verification: Run the QA agent on every guide before approaching the blogger.
//
// ─── SOURCE VERIFICATION FORMAT ──────────────────────────────────────────────
//   Add a comment above each entry with the source URL:
//   // SOURCE: https://bloggersite.com/post-about-this-place/
//   Or mark clearly if no dedicated post exists:
//   // ⚠️ No dedicated post — factual description, not attributed as blogger's words

const PLACES = [

  // ─── NEIGHBOURHOOD NAME ───────────────────────────────────────────────────

  {
    // SOURCE: https://bloggersite.com/post-about-this-place/
    id: 1,
    nbhd: 'key',                   // must match map.js NBHD_APPROX_CENTERS key (NO 'nbhd-' prefix)
    name: 'Place Name',
    cat: 'landmark',               // landmark/food/cafe/pub/church/market/soviet/nature
    emoji: '🏛️',
    address: 'Full address, Neighbourhood',
    lat: 0.0000,
    lng: 0.0000,
    search: 'Place Name City',
    note: "Blogger's exact published words — copied verbatim from their article. Never invented or paraphrased.",
    hours: 'Daily 9am–6pm',
    tip: "Blogger's exact words for the tip, or leave empty string if none.",
    type: 'Type of Place',         // short label e.g. 'Historic Market', 'Cocktail Bar'
    blog: 'https://bloggersite.com/post-about-this-place/',
    phone: '+1 234 567 8900',
    website: 'https://placename.com',
  },

  {
    // SOURCE: https://bloggersite.com/food-guide/
    id: 2,
    nbhd: 'nbhd-key',
    name: 'Another Place',
    cat: 'food',
    emoji: '🍽️',
    address: 'Full address, Neighbourhood',
    lat: 0.0000,
    lng: 0.0000,
    search: 'Another Place City food',
    note: "Second place description — blogger's exact words.",
    hours: 'Tue–Sun 1pm–10pm',
    tip: 'Book in advance — it fills up fast.',
    type: 'Restaurant',
    blog: 'https://bloggersite.com/food-guide/',
    phone: '',
    website: 'https://anotherplace.com',
  },

  // ─── NEXT NEIGHBOURHOOD ───────────────────────────────────────────────────

  {
    // ⚠️ No dedicated post — factual description only, not attributed as blogger's words
    id: 3,
    nbhd: 'key-2',
    name: 'Third Place',
    cat: 'cafe',
    emoji: '🍸',
    address: 'Full address, Neighbourhood 2',
    lat: 0.0000,
    lng: 0.0000,
    search: 'Third Place City bar cocktails',
    note: "Third place description.",
    hours: 'Daily 5pm–midnight',
    tip: 'Arrive before 8pm to get a seat.',
    type: 'Cocktail Bar',
    blog: 'https://bloggersite.com/bars-guide/',
    phone: '',
    website: '',
  },

];
