// A Perfect Story Map — Shantaram
// data.js — 11 places from the novel's world
//
// v1 — July 2026 — UNLISTED CONCEPT DEMO for publisher pitches only.
// Not affiliated with Gregory David Roberts or his publishers.
// All scene references are described in our own words; no text from the
// novel is reproduced. Real-place facts (history, visiting info) are from
// public sources. Two locations are fictional or composite and are
// marked as such in their notes, with approximate map positions.
//
// Voice: the concierge who has read the book — direct, specific, warm.
// READING-FIRST fields (July 2026 redesign):
//   book  : where this place lives in the novel + what happens there (📖 line)
//   visit : one compact travel footer line ("If you visit"), replaces hours+tip
// Four categories: Lin's Bombay · Friends & Lovers · Underworld & Prison · The Long Journeys
// Four regions: colaba, city, maha, afghan

const PLACES = [

  // ── COLABA ────────────────────────────────────────────────────────────────

  {
    id: 1,
    nbhd: 'colaba',
    name: 'Leopold Cafe',
    cat: 'bond',
    emoji: '☕',
    address: 'Colaba Causeway, Colaba, Mumbai',
    lat: 18.9226, lng: 72.8317,
    search: 'Leopold Cafe Mumbai Colaba Causeway interior',
    note: 'The living room of the novel. This is where Lin\'s Bombay life is negotiated over marble tables: the expatriate circle, the deals, the conversations that steer the whole story. The cafe is real and has traded on the Causeway since 1871. It survived the 2008 attacks and chose to keep some of the damage visible rather than erase it. Readers from around the world already make the pilgrimage here; the book made a Victorian cafe into a literary landmark.',
    book: 'From the opening pages onward. The story keeps returning to these tables in every part of the novel: this is where deals are struck, friendships form, and trouble finds Lin.',
    visit: 'Open daily until late. Come in the late-afternoon lull for one of the famous tables; the upstairs room is quieter.',
    type: 'Historic cafe, trading since 1871 — the novel\'s social hub',
    website: 'https://www.leopoldcafe.com',
  },
  {
    id: 2,
    nbhd: 'colaba',
    name: 'Gateway of India',
    cat: 'life',
    emoji: '🏛️',
    address: 'Apollo Bunder, Colaba, Mumbai',
    lat: 18.9220, lng: 72.8347,
    search: 'Gateway of India Mumbai basalt arch harbour',
    note: 'Every arrival in the novel\'s Bombay begins here, at the basalt arch on the harbour where the boats leave for Elephanta and the whole city seems to pass in an afternoon. Built to mark a royal visit in 1911 and completed in 1924, it was the ceremonial front door of colonial Bombay: the right symbol for a book about a man walking into a new life with a false passport and nothing else.',
    book: 'The early Bombay chapters. The monument anchors the small triangle of streets where Lin\'s new life begins: everything in the novel\'s opening world lies between this arch and the Causeway behind it.',
    visit: 'Open 24 hours, liveliest at sunset. Stand with your back to the arch: the Taj facade and the Causeway complete the novel\'s opening stage.',
    type: 'Harbourfront monument, 1924 — where the novel\'s Bombay begins',
  },
  {
    id: 3,
    nbhd: 'colaba',
    name: 'Taj Mahal Palace Hotel',
    cat: 'bond',
    emoji: '🏨',
    address: 'Apollo Bunder, Colaba, Mumbai',
    lat: 18.9217, lng: 72.8331,
    search: 'Taj Mahal Palace Hotel Mumbai facade dome',
    note: 'The grand stage of the Bombay the novel\'s foreigners orbit: the glamour that stands a few minutes\' walk from the slum, which is the whole point. Opened in 1903 by Jamsetji Tata, the Taj is the counterweight the story keeps returning to, the city of silk a street away from the city of struggle. No other pair of neighbours explains the book\'s Bombay faster.',
    book: 'A backdrop throughout the Bombay chapters: the world of silk and money that stands a few minutes from the slum, the contrast the whole novel is built on.',
    visit: 'Public spaces and restaurants welcome visitors; afternoon tea in the Sea Lounge is the gentlest way inside.',
    type: 'Grand hotel, 1903 — the novel\'s counterpoint of glamour',
    website: 'https://www.tajhotels.com',
  },
  {
    id: 4,
    nbhd: 'colaba',
    name: 'The Slum by Cuffe Parade',
    cat: 'life',
    emoji: '🩺',
    address: 'Near Cuffe Parade, South Mumbai (approximate)',
    lat: 18.9155, lng: 72.8210,
    search: 'Cuffe Parade Mumbai hutments skyline contrast',
    note: 'The moral centre of the novel: the settlement where Lin lives after losing everything, and where he opens a free clinic in his hut. The book\'s slum is a fictionalized composite, drawn from the real hutment settlements of South Bombay where the author himself lived and ran a clinic in the 1980s. The map position is approximate by design. This chapter of the story is why so many readers say the book changed how they see cities.',
    book: 'The heart of the book\'s first half. After losing everything, Lin builds a hut here, opens his free clinic, and is remade by the community: the chapters most readers never forget.',
    visit: 'A living neighbourhood, not a sight. Go only with a resident-led community tour, and always ask before photographing.',
    type: 'Fictionalized composite — the novel\'s heart, marked approximately',
  },

  // ── GREATER BOMBAY ────────────────────────────────────────────────────────

  {
    id: 5,
    nbhd: 'city',
    name: 'Marine Drive',
    cat: 'life',
    emoji: '🌊',
    address: 'Netaji Subhash Chandra Bose Road, Mumbai',
    lat: 18.9435, lng: 72.8234,
    search: 'Marine Drive Mumbai Queens Necklace night curve',
    note: 'The three-kilometre crescent of seafront where the city comes to breathe, and where the novel\'s restless walking happens. At night the streetlamps curve along the bay like a string of pearls, which is why the city calls it the Queen\'s Necklace. Art deco apartment blocks line the landward side, one of the largest collections of art deco buildings in the world.',
    book: 'Threaded through all the Bombay chapters: the seafront of the novel\'s restless night walks, where the city and the narrator talk to each other.',
    visit: 'Walk it at dusk, south to north, finishing at Chowpatty as the Queen\'s Necklace lights come on.',
    type: 'Seafront promenade — the Queen\'s Necklace',
  },
  {
    id: 6,
    nbhd: 'city',
    name: 'Haji Ali Dargah',
    cat: 'bond',
    emoji: '🕌',
    address: 'Dargah Road, off Lala Lajpat Rai Marg, Mumbai',
    lat: 18.9826, lng: 72.8090,
    search: 'Haji Ali Dargah Mumbai causeway sea mosque',
    note: 'A white shrine floating on an islet in the sea, reached by a narrow causeway that disappears at high tide. Built in memory of a Sufi saint who died on pilgrimage, it has stood in the bay since the 15th century. In the novel\'s Bombay it belongs to the night-time city of meetings and confidences, and no location photographs the book\'s mixture of faith and street better.',
    book: 'The night-time city of the middle chapters, where the novel\'s worlds of faith and street business meet by the sea.',
    visit: 'The causeway floods at high tide, so check tide times; near sunset is best. Modest dress, shoulders and knees covered.',
    type: '15th-century Sufi shrine on the sea',
  },
  {
    id: 7,
    nbhd: 'city',
    name: 'Victoria Terminus (CSMT)',
    cat: 'journey',
    emoji: '🚂',
    address: 'Dr Dadabhai Naoroji Road, Fort, Mumbai',
    lat: 18.9398, lng: 72.8355,
    search: 'Chhatrapati Shivaji Terminus Mumbai Victorian Gothic facade',
    note: 'The cathedral of Indian railways, a Victorian Gothic palace of turrets and gargoyles finished in 1888 and now a UNESCO World Heritage Site. In the novel this is the gate to everywhere beyond Bombay: the crush on the platforms, the train that carries Lin and Prabaker toward the village, the moment the city lets go of the story for a while. Three million passengers still pass through every day.',
    book: 'Early in the novel: the platform crush and the train that carries Lin and Prabaker out of the city toward the village, the journey that will name the book.',
    visit: 'Find the stone menagerie on the facade: monkeys, peacocks, and a British lion facing an Indian tiger. Watch rush hour safely from the mezzanine.',
    type: 'Victorian Gothic terminus, 1888 — UNESCO World Heritage',
  },
  {
    id: 8,
    nbhd: 'city',
    name: 'Arthur Road Prison',
    cat: 'dark',
    emoji: '⛓️',
    address: 'Sane Guruji Marg, Chinchpokli, Mumbai (viewed from outside only)',
    lat: 18.9797, lng: 72.8266,
    search: 'Arthur Road Jail Mumbai outer wall gate',
    note: 'Mumbai Central Prison, still universally known by its old name, is the darkest chapter of the novel: the months of Lin\'s imprisonment without charge are the book\'s descent, and the author has said his own time inside Indian and Australian prisons shaped it. Built in the 1920s and chronically overcrowded ever since, it remains a working prison. It is on the map because the story cannot be understood without it, not because it can be visited.',
    book: 'The darkest stretch of the book\'s middle: months of imprisonment without charge, the descent the rest of the story has to climb out of.',
    visit: 'A working prison with no public access. There is nothing to see beyond the wall, and that is the point; read these chapters by Marine Drive instead, in the open air the character dreams about.',
    type: 'Working prison, 1920s — the novel\'s darkest chapter, exterior only',
  },
  {
    id: 9,
    nbhd: 'city',
    name: 'Film City, Goregaon',
    cat: 'life',
    emoji: '🎥',
    address: 'Film City Complex, Goregaon East, Mumbai (approximate)',
    lat: 19.1650, lng: 72.8770,
    search: 'Film City Mumbai Bollywood studio gate',
    note: 'The novel\'s lightest running joke: foreigners recruited from the Causeway cafes to play extras in Bollywood productions, a real and thriving practice to this day. Bombay\'s studio city in the northern suburbs covers over 200 hectares of sound stages and permanent sets. Lin\'s film-extra episodes are the book\'s reminder that the city that can imprison you can also cast you in a musical number the same month.',
    book: 'The comic relief of the Bombay chapters: a foreigner recruited from a cafe table into an accidental Bollywood career, a real practice to this day.',
    visit: 'Entry by bookable guided tour only. And if you sit long enough in a Colaba cafe, the casting scouts may still find you, exactly as in the book.',
    type: 'Bollywood studio complex — the novel\'s comic relief',
  },

  // ── MAHARASHTRA ───────────────────────────────────────────────────────────

  {
    id: 10,
    nbhd: 'maha',
    name: 'Sunder — Prabaker\'s Village',
    cat: 'journey',
    emoji: '🌾',
    address: 'Rural Maharashtra (fictional village — position symbolic)',
    lat: 17.9000, lng: 74.5000,
    search: 'Maharashtra village fields bullock monsoon rural',
    note: 'The village where the book earns its title: six months of rains, fieldwork and belonging, at the end of which Lin is given the Marathi name Shantaram, man of God\'s peace. The village is fictional, and this marker stands symbolically in the farming country of the Maharashtra interior, a day\'s journey from Bombay by train and bus, the way the book describes the trip. It is the hinge of the whole novel: the name on the cover is given here.',
    book: 'The long journey of the book\'s first part: six months of rains and fieldwork, at the end of which the villagers give Lin the name on the cover, Shantaram, man of God\'s peace.',
    visit: 'The village is fictional. The real equivalent is an agritourism homestay in interior Maharashtra, in or just after the monsoon, when the book\'s green landscape is real.',
    type: 'Fictional village — where the novel gets its name',
  },

  // ── AFGHANISTAN ───────────────────────────────────────────────────────────

  {
    id: 11,
    nbhd: 'afghan',
    name: 'The Mountains near Kandahar',
    cat: 'journey',
    emoji: '🏔️',
    address: 'Kandahar Province, Afghanistan (approximate — do not travel)',
    lat: 31.6200, lng: 65.7100,
    search: 'Afghanistan mountains winter snow pass horsemen',
    note: 'The novel\'s furthest reach: the winter journey out of Bombay and into the war in Afghanistan in the 1980s, the section that turns a city story into an epic. The map position is approximate; the book\'s route through the mountains is deliberately vague. Seeing this marker two thousand kilometres from the Colaba cluster is the fastest way to feel the shape of the novel: how far one man is pulled from the cafe table where it all began.',
    book: 'The final act: the winter journey out of Bombay and into the war, the section that turns a city story into an epic.',
    visit: 'Not a destination. Zoom the map out instead: seeing this marker beside the Colaba cluster is the novel in a single gesture.',
    type: 'The war chapters, 1980s — marked for story geography, not travel',
  },

];
