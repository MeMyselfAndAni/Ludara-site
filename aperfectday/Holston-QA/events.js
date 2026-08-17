// ── SPECIAL EVENTS ────────────────────────────────────────────
// Time-limited "What's On" events for the Holston House guide.
// Each event is a place with cat:'event' so it reuses pins, cards and favourites.
// It is shown ONLY when the What's On pill is active AND its dates fall
// within the next EVENT_WINDOW_DAYS. Past events disappear automatically.
//
// MAINTENANCE: every field below is verified against the event's own official
// site. When refreshing monthly, re-confirm dates/venue/admission before adding.
// IDs start at 9001 to never collide with real place IDs. Keep notes free of
// double-quotes and curly quotes (curly quotes break inline JS).

const EVENT_WINDOW_DAYS = 31;

const EVENTS = [
  {
    id: 9001, cat: 'event', emoji: '📅',
    name: 'Wine on the River',
    lat: 36.1620, lng: -86.7745,
    address: 'Sep 12 · Riverfront Park',
    startDate: '2026-09-12', endDate: '2026-09-12',
    hours: 'Sat 3:00 PM – 7:00 PM (VIP 2:30 PM)',
    admission: 'Ticketed',
    url: 'https://www.wineontherivernashville.com/',
    note: "Nashville's largest wine-and-spirits tasting takes over Riverfront Park: over 100 pours, live music and Cumberland River skyline views on a golden September afternoon."
  },
  {
    id: 9002, cat: 'event', emoji: '📅',
    name: 'AmericanaFest',
    lat: 36.1612, lng: -86.7785,
    address: 'Sep 15–19 · Ryman & citywide',
    startDate: '2026-09-15', endDate: '2026-09-19',
    hours: 'Nightly showcases across 50+ venues',
    admission: 'Ticketed · wristbands from $150',
    url: 'https://americanamusic.org/americanafest/',
    note: "For five nights, Nashville becomes the beating heart of American roots music. More than 200 artists play over 50 stages across the city, building to the Americana Honors and Awards at the storied Ryman on September 16."
  },
  {
    id: 9003, cat: 'event', emoji: '📅',
    name: 'Shakespeare in the Park',
    lat: 36.1486, lng: -86.8125,
    address: 'Aug 20–Sep 20 · Centennial Park',
    startDate: '2026-08-20', endDate: '2026-09-20',
    hours: 'Thu–Sun 7:00 PM (pre-show concert 6:00 PM)',
    admission: 'Pay what you will',
    url: 'https://www.nashvilleshakes.org/shakespeare-in-the-park',
    note: "The Nashville Shakespeare Festival stages A Midsummer Night's Dream free under the stars at the Centennial Park bandshell. Bring a blanket, arrive for the 6 PM pre-show concert, and let the fairies work their mischief."
  },
  {
    id: 9004, cat: 'event', emoji: '📅',
    name: 'Nashville Film Festival',
    lat: 36.1290, lng: -86.7975,
    address: 'Sep 24–30 · Belcourt & venues',
    startDate: '2026-09-24', endDate: '2026-09-30',
    hours: 'Screenings daily · times vary',
    admission: 'Ticketed',
    url: 'https://nashvillefilmfestival.org/2026-festival/',
    note: "The 57th Nashville Film Festival brings nearly 150 films from around the world to Nashville screens, with Q&As, panels and premieres across the beloved Belcourt Theatre and other arts venues."
  },
  {
    id: 9005, cat: 'event', emoji: '📅',
    name: 'Nashville Oktoberfest',
    lat: 36.1680, lng: -86.7840,
    address: 'Oct 1–4 · Bicentennial Mall',
    startDate: '2026-10-01', endDate: '2026-10-04',
    hours: 'Thu 5–10 PM · Fri–Sat 11 AM–10 PM · Sun 11 AM–5 PM',
    admission: 'Tickets from $12',
    url: 'https://thenashvilleoktoberfest.com/',
    note: "Nashville's oldest street festival pours its first stein on October 1. Four days of imported German draft beer, sizzling bratwurst, oompah bands and the beloved Dachshund Derby fill Bicentennial Mall with autumn cheer."
  },
  {
    id: 9006, cat: 'event', emoji: '📅',
    name: 'Fall Tennessee Craft Fair',
    lat: 36.1497, lng: -86.8130,
    address: 'Oct 9–11 · Centennial Park',
    startDate: '2026-10-09', endDate: '2026-10-11',
    hours: 'Fri–Sun · times confirmed closer to date',
    admission: 'Free',
    url: 'https://www.conservancyonline.com/events/tennesseecraftfall',
    note: "One of the country's top craft fairs fills Centennial Park beside the Parthenon: more than 150 juried artists, live demonstrations and food, all free to wander."
  },
  {
    id: 9007, cat: 'event', emoji: '📅',
    name: 'Fall Ball, Y all Festival',
    lat: 36.1719, lng: -86.7870,
    address: 'Oct 10 · Nashville Farmers Market',
    startDate: '2026-10-10', endDate: '2026-10-10',
    hours: 'Sat 10:00 AM – 2:00 PM',
    admission: 'Free',
    url: 'https://www.nashvillefarmersmarket.org/event-calendar/2026-fall-ball-yall-festival',
    note: "A free harvest party at the Nashville Farmers Market: live music on two stages, pony rides, a petting zoo, cooking demos and the season's best produce, all in one bright autumn morning."
  },
  {
    id: 9008, cat: 'event', emoji: '📅',
    name: 'Southern Festival of Books',
    lat: 36.1685, lng: -86.7845,
    address: 'Oct 17–18 · Bicentennial Mall',
    startDate: '2026-10-17', endDate: '2026-10-18',
    hours: 'Sat 9 AM–6 PM · Sun 10 AM–5 PM',
    admission: 'Free',
    url: 'https://www.sofestofbooks.org/',
    note: "One of America's oldest literary festivals returns downtown: two free days of author talks, readings and signings across Bicentennial Mall and the Tennessee State Museum."
  },
  {
    id: 9009, cat: 'event', emoji: '📅',
    name: 'Franklin PumpkinFest',
    lat: 35.9251, lng: -86.8689,
    address: 'Oct 24–25 · Downtown Franklin',
    startDate: '2026-10-24', endDate: '2026-10-25',
    hours: 'Sat–Sun 10:00 AM – 6:00 PM',
    admission: 'Free',
    url: 'https://williamsonheritage.org/events/pumpkinfest/',
    note: "Middle Tennessee's biggest family fall festival takes over historic downtown Franklin: 140-plus makers, costume contests, food and live music, now spread across two days. A lovely half-hour drive south."
  },
  {
    id: 9010, cat: 'event', emoji: '📅',
    name: 'CMA Awards',
    lat: 36.1593, lng: -86.7785,
    address: 'Nov 18 · Bridgestone Arena',
    startDate: '2026-11-18', endDate: '2026-11-18',
    hours: 'Wed · live broadcast 7:00 PM CT',
    admission: 'Ticketed',
    url: 'https://cmaawards.com/',
    note: "Country music's biggest night, the 60th Annual CMA Awards, broadcasts live from Bridgestone Arena. Even without a ticket, downtown glitters all week with the genre's brightest stars in town."
  }
];

// ── Date helpers (respect the guide's local timezone) ─────────
function _apdEventToday(){
  var tz = (typeof GUIDE_TIMEZONE !== 'undefined' && GUIDE_TIMEZONE) ? GUIDE_TIMEZONE : 'America/Chicago';
  var d = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
  d.setHours(0,0,0,0);
  return d;
}
function _apdParseDate(str){
  var p = String(str).split('-');
  return new Date(+p[0], +p[1]-1, +p[2]);
}
// True when an event ends today or later AND starts within the next month.
function isEventInWindow(p){
  if(!p || p.cat !== 'event') return false;
  var today = _apdEventToday();
  var start = _apdParseDate(p.startDate);
  var end   = _apdParseDate(p.endDate);
  var horizon = new Date(today);
  horizon.setDate(horizon.getDate() + EVENT_WINDOW_DAYS);
  return end >= today && start <= horizon;
}
// True while an event has NOT yet ended (ends today or later). Used to make sure
// a passed event is never displayed, even if a guest had saved it to favourites.
function isEventNotPassed(p){
  if(!p || p.cat !== 'event') return true;
  return _apdParseDate(p.endDate) >= _apdEventToday();
}
// Gold calendar glyph (matches the map pin) for the list thumbnail.
function eventGlyphHTML(){
  return '<svg width="26" height="26" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<rect x="5" y="0.5" width="2.4" height="5" rx="1.2" fill="#FFC12E"/>'
    + '<rect x="12.6" y="0.5" width="2.4" height="5" rx="1.2" fill="#FFC12E"/>'
    + '<rect x="1" y="3" width="18" height="16" rx="2.6" fill="#FFC12E"/>'
    + '<rect x="1" y="3" width="18" height="5" rx="2.6" fill="#2B211C"/>'
    + '<g fill="#2B211C"><rect x="4.2" y="10.2" width="2.3" height="2.3"/><rect x="8.85" y="10.2" width="2.3" height="2.3"/><rect x="13.5" y="10.2" width="2.3" height="2.3"/><rect x="4.2" y="13.9" width="2.3" height="2.3"/><rect x="8.85" y="13.9" width="2.3" height="2.3"/></g>'
    + '</svg>';
}
// True when an event is happening today (used so Open Now also counts live events).
function isEventOnNow(p){
  if(!p || p.cat !== 'event') return false;
  var today = _apdEventToday();
  return _apdParseDate(p.startDate) <= today && _apdParseDate(p.endDate) >= today;
}
// Small chip label for the card / list.
function eventDayLabel(p){
  var today = _apdEventToday();
  var start = _apdParseDate(p.startDate);
  var end   = _apdParseDate(p.endDate);
  var tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
  if(start <= today && end >= today) return 'On now';
  if(start.getTime() === today.getTime()) return 'Today';
  if(start.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return 'Coming up';
}

// Merge events into PLACES so pins, cards and favourites work natively.
// (Visibility is still gated by the What's On filter + date window.)
if (typeof PLACES !== 'undefined' && Array.isArray(PLACES)) {
  EVENTS.sort(function(a,b){ return a.startDate < b.startDate ? -1 : (a.startDate > b.startDate ? 1 : 0); });
  PLACES.push.apply(PLACES, EVENTS);
}
