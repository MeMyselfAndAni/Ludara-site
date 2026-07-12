// A Perfect Story Map — Bridgerton in Bath
// data.js — 10 real filming locations in Bath, England
//
// v1 — July 2026 — UNLISTED CONCEPT DEMO / bespoke sample for Visit West.
// Not affiliated with Netflix, Shondaland or the Bridgerton production.
// Scene references are described in our own words; no script or dialogue is
// reproduced. All filming locations are confirmed by VisitBath (Visit West):
//   https://www.visitbath.co.uk/inspire-me/film-and-tv-in-bath/bridgerton-in-bath
// Real-place facts (history, visiting info) are from public sources.
//
// Voice: the concierge who knows both the show and the city — warm, specific.
//   book  : the scene this place plays in the show (shown with a film icon)
//   visit : one compact "If you visit" footer line
// Three categories: The Ton & Society · Great Houses · Regency Streets & Shops
// Three regions: crescent, centre, pulteney

const PLACES = [

  // ── ROYAL CRESCENT & THE CIRCUS ───────────────────────────────────────────
  {
    id: 2,
    nbhd: 'crescent',
    name: 'The Royal Crescent',
    cat: 'ton',
    emoji: '👑',
    address: 'Royal Crescent, Bath BA1 2LR',
    lat: 51.3870, lng: -2.3720,
    search: 'Royal Crescent Bath Georgian terrace',
    note: 'The single most recognisable face of Bridgerton\'s Bath: the great sweep of the Royal Crescent stands in for the grandest addresses of the ton, where the season\'s families promenade and arrive by carriage. Built between 1767 and 1775 to a design by John Wood the Younger, its thirty Georgian houses curve in one continuous palace front above Royal Victoria Park. It is fully outdoors and free to walk, which makes it the natural first stop of any Bridgerton day.',
    book: 'The ton promenading: grand exterior street scenes',
    visit: 'Open parkland, free at any hour. Best light is late afternoon, when the honey-coloured stone glows.',
    type: 'Bridgerton · the world of the ton',
  },
  {
    id: 3,
    nbhd: 'crescent',
    name: 'No.1 Royal Crescent',
    cat: 'home',
    emoji: '🏠',
    address: '1 Royal Crescent, Bath BA1 2LR',
    lat: 51.3866, lng: -2.3696,
    search: 'No 1 Royal Crescent museum Bath',
    note: 'The end house of the Crescent plays a family home of the ton, its door and entrance hall dressed for the season. Today it is a restored Georgian townhouse museum that shows both the elegant rooms upstairs and the working world below stairs, exactly the two worlds the show loves to move between. The exterior is free to admire; the interior is a ticketed museum.',
    book: 'A grand family townhouse of the season',
    visit: 'Museum open most days, ticketed. The exterior and the Crescent lawn are free.',
    type: 'Bridgerton · a house of the ton',
    website: 'https://no1royalcrescent.org.uk',
  },

  // ── THE GEORGIAN CENTRE ────────────────────────────────────────────────────
  {
    id: 4,
    nbhd: 'centre',
    name: 'Abbey Green (The Abbey Deli)',
    cat: 'street',
    emoji: '👗',
    address: 'Abbey Green, Bath BA1 1NW',
    lat: 51.3803, lng: -2.3585,
    search: 'Abbey Green Bath Abbey Deli plane tree',
    note: 'This quiet, tree-shaded square behind the Roman Baths is where the modiste\'s dress shop comes to life, and part of the square also stood in for the bustle of Covent Garden. The double-fronted, bay-windowed Abbey Deli plays the dressmaker\'s, and still leans into the connection with themed treats. A huge London plane tree fills the middle of the square, so it reads as pure Regency the moment you step in.',
    book: 'Madame Delacroix\'s modiste, and a Covent Garden stand-in',
    visit: 'A working square and cafe, free to wander. Quietest early morning before the lanes fill.',
    type: 'Bridgerton · the modiste',
  },
  {
    id: 5,
    nbhd: 'centre',
    name: 'Bath Street',
    cat: 'street',
    emoji: '🏛️',
    address: 'Bath Street, Bath BA1 1SA',
    lat: 51.3813, lng: -2.3600,
    search: 'Bath Street colonnade Cross Bath',
    note: 'A short, elegant street lined with covered colonnades on both sides, running between the Cross Bath and the Grand Pump Room. With no modern shopfronts or signage in view, it films as authentic eighteenth-century Bath and appears in the show\'s Regency street scenes. Being fully pedestrian and symmetrical, it is one of the most photogenic stops on the trail.',
    book: 'Regency street scenes under the colonnades',
    visit: 'Pedestrian and free, day or night. Walk it toward the Cross Bath for the framed view.',
    type: 'Bridgerton · Regency streets',
  },
  {
    id: 6,
    nbhd: 'centre',
    name: 'Beauford Square',
    cat: 'ton',
    emoji: '💃',
    address: 'Beauford Square, Bath BA1 1JY',
    lat: 51.3838, lng: -2.3635,
    search: 'Beauford Square Bath Theatre Royal cottages',
    note: 'A hidden square of small two-storey cottages laid out in 1730, with the original frontage of the Theatre Royal along its south side and a railed lawn in the middle. It hosts carriage and strolling scenes, including a well-remembered quiet conversation between two of the show\'s young women. Note the spelling: it is Beauford, not Beaufort. It is outdoors and free.',
    book: 'Carriage and strolling scenes between characters',
    visit: 'A residential square, free to visit. Please keep noise down for residents.',
    type: 'Bridgerton · the season on foot',
  },
  {
    id: 7,
    nbhd: 'centre',
    name: 'Trim Street',
    cat: 'street',
    emoji: '🚶',
    address: 'Trim Street, Bath BA1 1HB',
    lat: 51.3840, lng: -2.3625,
    search: 'Trim Street Bath historic lane',
    note: 'A narrow historic street just around the corner from Beauford Square, used for additional exterior street scenes. It is an easy few steps from several other stops, which is what makes the compact Georgian core of Bath so filmable: whole streetscapes stay in period without a single modern intrusion. Free to walk as part of the central loop.',
    book: 'Additional Regency exterior street scenes',
    visit: 'Central and free. Combine with Beauford Square, which is next door.',
    type: 'Bridgerton · Regency streets',
  },
  {
    id: 8,
    nbhd: 'centre',
    name: 'The Assembly Rooms',
    cat: 'ton',
    emoji: '🕯️',
    address: 'Bennett Street, Bath BA1 2QH',
    lat: 51.3862, lng: -2.3607,
    search: 'Bath Assembly Rooms ballroom chandeliers',
    note: 'The social heart of Georgian Bath, and a natural home for the show\'s grand balls and society gatherings. Its ballroom is the largest eighteenth-century room in the city and still hangs its original crystal chandeliers. Owned by the National Trust, the interiors are currently open by guided tour only while a new Georgian visitor experience is created, so check access before you go.',
    book: 'Grand balls and society gatherings',
    visit: 'Interiors by guided tour for now; a new experience is due to open in 2027. Check ahead.',
    type: 'Bridgerton · the ballroom',
    website: 'https://www.nationaltrust.org.uk/visit/bath-bristol/bath-assembly-rooms',
  },
  {
    id: 9,
    nbhd: 'centre',
    name: 'The Guildhall',
    cat: 'ton',
    emoji: '✨',
    address: 'High Street, Bath BA1 5AW',
    lat: 51.3818, lng: -2.3585,
    search: 'Bath Guildhall Banqueting Room interior',
    note: 'The Guildhall\'s Banqueting Room, all gilded plasterwork, chandeliers and full-length portraits, provides interiors for additional ball scenes. It is a working civic and events venue, so public access is by event or hire rather than a daily walk-in, but the exterior sits right in the centre beside the Guildhall Market. A good stop to admire from the street on the central loop.',
    book: 'Interiors for additional ball scenes',
    visit: 'Event and hire venue, so interiors are not a daily walk-in. Admire the exterior from High Street.',
    type: 'Bridgerton · the ballroom',
  },

  // ── GREAT PULTENEY & BATHWICK ──────────────────────────────────────────────
  {
    id: 1,
    nbhd: 'pulteney',
    name: 'The Holburne Museum',
    cat: 'home',
    emoji: '🏛️',
    address: 'Great Pulteney Street, Bath BA2 4DB',
    lat: 51.3856, lng: -2.3520,
    search: 'Holburne Museum Bath Great Pulteney Street facade',
    note: 'The grand facade at the head of Great Pulteney Street is the exterior of Lady Danbury\'s house, one of the show\'s most beloved addresses, seen across the seasons. The building began as an eighteenth-century hotel and is now an art museum with a permanent collection, changing exhibitions and a garden behind. The exterior and garden are free to enjoy; the galleries are ticketed.',
    book: 'Lady Danbury\'s house (exterior), across the seasons',
    visit: 'Grounds and exterior free. Galleries ticketed, closed some Mondays. Cafe in the garden.',
    type: 'Bridgerton · Lady Danbury\'s residence',
    website: 'https://www.holburne.org',
  },
  {
    id: 10,
    nbhd: 'pulteney',
    name: 'Edward Street',
    cat: 'street',
    emoji: '🐎',
    address: 'Edward Street, Bath BA2 4DP',
    lat: 51.3853, lng: -2.3548,
    search: 'Edward Street Bath Georgian Bathwick',
    note: 'A picture-perfect residential Georgian street just off Great Pulteney Street, steps from the Holburne Museum, used from Season 3 for carriage and crowd scenes. For filming the road was gravelled over to look period-accurate, a small touch that shows how little of Bath needs changing to become the Regency world. Outdoors and free, and a natural pairing with the Holburne next door.',
    book: 'Carriage and crowd scenes, from Season 3',
    visit: 'A residential street, free to walk. Pair it with the Holburne Museum a minute away.',
    type: 'Bridgerton · the streets of the season',
  },

];
