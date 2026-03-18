// ── PLACES DATA — replace with guide-specific places ─────────
// Each place must have all fields below.
// nbhd values must match keys in NBHD_APPROX_CENTERS in map.js
// cat values: landmark / food / cafe / church / market / soviet / nature

const PLACES = [
  {
    id: 1,
    nbhd: "neighbourhood-id",       // must match a key in NBHD_APPROX_CENTERS
    name: "Place Name",
    cat: "landmark",                 // landmark / food / cafe / church / market / soviet / nature
    emoji: "🏛️",
    address: "123 Street Name",
    lat: 0.0000,
    lng: 0.0000,
    search: "Place Name City",       // used for Google Maps search link
    note: "Emily's description of this place.",
    hours: "Daily 9:00–18:00",
    tip: "Optional insider tip.",
    type: "Type of place",
    blog: "https://blogger.com/link-to-post",
    phone: "+1 234 567 8900",
    website: "https://place-website.com",
  },
  // add more places...
];
