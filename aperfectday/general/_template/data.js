// ── GUIDE DATA ────────────────────────────────────────────────
// Replace all UPPERCASE placeholders with guide-specific values
// localStorage key must be unique per guide: '[city]-favs'

const PLACES = [
  // Example structure — delete and replace with real places:
  // {
  //   id: 1,
  //   nbhd: "neighbourhood-id",       // must match NBHD_CIRCLES id in map.js
  //   name: "Place Name",
  //   cat: "landmark",                // landmark|food|cafe|church|market|soviet|nature
  //   emoji: "🏛️",
  //   address: "Street, Neighbourhood",
  //   lat: 0.0000, lng: 0.0000,
  //   search: "Place Name City",      // used for Google Places photo lookup
  //   note: "Blogger's personal note about this place.",
  //   hours: "Daily 09:00–22:00",
  //   tip: "Insider tip from the blogger.",
  //   type: "Type description",
  //   blog: "https://blogger.com/post",
  //   phone: "+1 234 567 8900",
  //   website: "https://place.com"
  // },
];

// ── GLOBALS (do not rename — used across all platform files) ──
let map, markers={}, placesService, AID=null, AF='all', ANF='all';

// Category colours
const CC = {
  landmark:'#e8724a', food:'#f0c060', cafe:'#6b9e6e',
  church:'#6090c8',   market:'#c08060', soviet:'#9080a8', nature:'#50906a'
};

// Category labels
const CL = {
  landmark:'Landmark & Sight', food:'Restaurant', cafe:'Café & Bar',
  church:'Church & Spiritual', market:'Market', soviet:'Soviet Heritage',
  nature:'Nature & Views'
};

// localStorage key — CHANGE THIS per guide (e.g. 'london-favs', 'prague-favs')
const FAVS_KEY = 'CITYNAME-favs';
