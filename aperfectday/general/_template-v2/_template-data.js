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
//   landmark / food / cafe / church / market / soviet / nature
//
// nbhd values must exactly match keys in NBHD_APPROX_CENTERS in map.js

const PLACES = [

  // ─── NEIGHBOURHOOD NAME ───────────────────────────────────────────────────

  {
    id: 1,
    nbhd: 'nbhd-key',              // must match map.js NBHD_APPROX_CENTERS key
    name: 'Place Name',
    cat: 'landmark',               // landmark/food/cafe/church/market/soviet/nature
    emoji: '🏛️',
    address: 'Full address, Neighbourhood',
    lat: 0.0000,
    lng: 0.0000,
    search: 'Place Name City',     // used by fetch-images script to find Wikimedia photo
    note: "Blogger's personal description in their own voice. What makes this place special, what to order, why they love it. Written as if the blogger is talking directly to the reader.",
    hours: 'Daily 9am–6pm',
    tip: 'Insider tip — the thing most tourists miss, or the best way to experience it.',
    type: 'Type of Place',         // short label e.g. 'Historic Market', 'Cocktail Bar'
    blog: 'https://bloggersite.com/post-about-this-place/',
    phone: '+1 234 567 8900',
    website: 'https://placename.com',
  },

  {
    id: 2,
    nbhd: 'nbhd-key',
    name: 'Another Place',
    cat: 'food',
    emoji: '🍽️',
    address: 'Full address, Neighbourhood',
    lat: 0.0000,
    lng: 0.0000,
    search: 'Another Place City food',
    note: "Second place description in blogger's voice.",
    hours: 'Tue–Sun 1pm–10pm',
    tip: 'Book in advance — it fills up fast.',
    type: 'Restaurant',
    blog: 'https://bloggersite.com/food-guide/',
    phone: '',
    website: 'https://anotherplace.com',
  },

  // ─── NEXT NEIGHBOURHOOD ───────────────────────────────────────────────────

  {
    id: 3,
    nbhd: 'nbhd-key-2',
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
