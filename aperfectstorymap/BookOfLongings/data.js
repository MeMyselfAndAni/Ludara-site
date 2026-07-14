// A Perfect Story Map — The Book of Longings
// data.js — 12 places from the novel's world
//
// v1 — July 2026 — UNLISTED CONCEPT DEMO for publisher pitches only.
// Not affiliated with Sue Monk Kidd or her publishers.
// All scene references are described in our own words; no text from the
// novel is reproduced. Real-place facts (history, visiting info) are from
// public sources. Several locations in the novel are fictional or their
// ancient sites are not precisely identified today; these are marked as
// such in their notes, with approximate, symbolic map positions.
//
// Voice: the concierge who has read the book — direct, specific, warm.
// READING-FIRST fields:
//   book  : where this place lives in the novel + what happens there (📖 line)
//   visit : one compact travel footer line ("If you visit"), replaces hours+tip
// Five story threads (categories): Ana's Galilee · Her Book of Longings ·
//   Exile in Alexandria · Jesus & the Ministry · Passover & the Passion
// Three regions: galilee, judea, egypt

const PLACES = [

  // ── GALILEE ───────────────────────────────────────────────────────────────

  {
    id: 1,
    nbhd: 'galilee',
    name: 'Sepphoris (Zippori)',
    cat: 'home',
    emoji: '🏛️',
    address: 'Zippori National Park, Lower Galilee',
    lat: 32.7519, lng: 35.2792,
    search: 'Sepphoris Zippori Roman mosaic Galilee ruins',
    note: 'Where the novel opens: the wealthy hillside city where Ana grows up as the daughter of the chief scribe to Herod Antipas, and where, in the market, she first meets a young craftsman named Jesus. Sepphoris was real and grand: Antipas rebuilt it early in the first century as the ornament of Galilee, and its excavated streets and floor mosaics, among them the famous face known as the Mona Lisa of the Galilee, are exactly the cultured, Roman-flavoured world the book gives Ana. It sits only an hour\'s walk from Nazareth, which is the whole geography of her early life in one glance.',
    book: 'The opening: Ana\'s girlhood in Galilee',
    visit: 'Zippori National Park is open daily; come for the mosaics and the view across the Galilee that Ana would have known.',
    type: 'With Ana, her aunt Yaltha, and the young Jesus in the market',
    website: 'https://en.parks.org.il',
  },
  {
    id: 2,
    nbhd: 'galilee',
    name: 'The Cave in the Hills',
    cat: 'voice',
    emoji: '📜',
    address: 'The hills near Nazareth (a fictional place: the position is symbolic)',
    lat: 32.6880, lng: 35.3260,
    search: 'limestone cave Galilee hills dry landscape',
    note: 'The secret heart of the book: the cave where Ana carries her incantation bowl and her scrolls, the stories of silenced women she has gathered, to bury them safe from a family that would burn them. It is here, on one of these visits, that she comes upon Jesus grieving for his father. The cave is the novel\'s emblem of a hidden voice kept alive, and the incantation bowl\'s prayer, that she be remembered as one who had a voice, is the seed of the whole story. The place is invented, so this marker stands symbolically in the dry hills above Nazareth.',
    book: 'The early chapters: Ana hides her scrolls',
    noDirections: true,
    visit: 'A fictional place, not a destination. The limestone hills and caves around Nazareth and the Galilee give a true sense of where Ana would have hidden her words.',
    type: 'Ana and her servant Lavi; and Jesus, mourning',
  },
  {
    id: 3,
    nbhd: 'galilee',
    name: 'Nazareth',
    cat: 'home',
    emoji: '🏘️',
    address: 'Nazareth, Lower Galilee',
    lat: 32.7021, lng: 35.2978,
    search: 'Nazareth old city Galilee hills stone houses',
    note: 'The heart of the novel: the small, poor village where Ana makes a married life with Jesus, his mother Mary, and his brothers, trading the comfort of Sepphoris for a crowded compound and the daily work of a peasant household. Nazareth was an obscure Galilean hamlet in the first century, which is precisely why the book sets Ana\'s deepest years here, far from her father\'s court. Today it is the largest Arab city in Israel; at its open-air Nazareth Village, first-century terraces, olive presses and houses are rebuilt to show the world Ana steps into.',
    book: 'The heart of the book: the marriage years',
    visit: 'Nazareth Village, an open-air recreation of first-century life, is the closest you can come to Ana and Jesus\'s daily world.',
    type: 'With Jesus, his mother Mary, and Yaltha',
    website: 'https://www.nazarethvillage.com',
  },
  {
    id: 4,
    nbhd: 'galilee',
    name: 'The Sea of Galilee',
    cat: 'ministry',
    emoji: '🌊',
    address: 'Sea of Galilee (Lake Kinneret), northern shore',
    lat: 32.8807, lng: 35.5750,
    search: 'Sea of Galilee Kinneret shore fishing boats dawn',
    note: 'The wide freshwater lake where, in the novel, Jesus falls in with the fishermen Andrew, Simon and John, and the pull of a public calling begins to draw him away from Ana and the household in Nazareth. The Sea of Galilee is real and still ringed by the places of the story: Capernaum on its north shore, the gentle hill remembered as the Mount of Beatitudes above it. For a book so concerned with what a woman must give up when a man is called to something larger, the open water is the right horizon.',
    book: 'As Jesus is drawn toward his ministry',
    visit: 'The northern shore, Capernaum and the Mount of Beatitudes, is walkable and quiet at dawn, the lake much as the book describes it.',
    type: 'Jesus with Andrew, Simon and John',
  },

  // ── JUDEA ─────────────────────────────────────────────────────────────────

  {
    id: 5,
    nbhd: 'judea',
    name: 'The Jordan River',
    cat: 'ministry',
    emoji: '💧',
    address: 'The Jordan River, near Jericho (Qasr el-Yahud / Al-Maghtas)',
    lat: 31.8372, lng: 35.5525,
    search: 'Jordan River baptism site reeds water Qasr el-Yahud',
    note: 'The riverbank where the novel follows the crowds to John the Immerser, the wild preacher of repentance, and where Jesus answers the call that will change everything for him and for Ana. The site is real and still visited on both banks: Qasr el-Yahud on the western side near Jericho, and Al-Maghtas, "Bethany beyond the Jordan," a UNESCO World Heritage Site on the eastern bank, both long held to mark where John baptised. The river is narrow and reed-lined, smaller than the weight the story places on it.',
    book: 'Jesus answers John\'s call',
    visit: 'Both banks of the Jordan are open to pilgrims; the eastern site, Al-Maghtas in Jordan, is a UNESCO World Heritage Site.',
    type: 'Jesus and John the Immerser',
  },
  {
    id: 9,
    nbhd: 'judea',
    name: 'Bethany',
    cat: 'passion',
    emoji: '🫒',
    address: 'Bethany (al-Eizariya), eastern slope of the Mount of Olives',
    lat: 31.7714, lng: 35.2606,
    search: 'Bethany al-Eizariya Mount of Olives village stone',
    note: 'The village of Lazarus, Martha and Mary, a place of shelter in the book: it is here Ana carries her injured friend Tabitha to safety, and here she arrives, delayed and desperate, on the eve of the final Passover. Bethany sat just over the Mount of Olives from Jerusalem, a short walk from the city, which made it the natural resting place for pilgrims. Today it is the town of al-Eizariya, where the Tomb of Lazarus is still shown to visitors.',
    book: 'The final Passover approaches',
    visit: 'Al-Eizariya, just east of Jerusalem over the Mount of Olives, keeps the Tomb of Lazarus as its focus.',
    type: 'With Lazarus, Martha and Mary of Bethany',
  },
  {
    id: 10,
    nbhd: 'judea',
    name: 'The Temple, Jerusalem',
    cat: 'passion',
    emoji: '🕍',
    address: 'The Temple Mount / Western Wall, Old City of Jerusalem',
    lat: 31.7780, lng: 35.2354,
    search: 'Jerusalem Temple Mount Western Wall old city stone',
    note: 'The great pilgrim destination of the book\'s Judea: the Temple that draws Ana and Jesus, with the Passover crowds, up to Jerusalem. In the novel\'s time this was Herod\'s Temple, the vast rebuilt sanctuary at the centre of Jewish life. Rome destroyed it in the year 70, a generation after the story; what survives is the Western Wall, part of the huge platform that held it, still the most revered site in Judaism. The scale of the place is the point: it is the stage on which the story turns from a marriage to a public tragedy.',
    book: 'Passover in Jerusalem',
    visit: 'The Western Wall and the Temple Mount platform stand in the Old City; modest dress and security checks apply.',
    type: 'Ana, Jesus and the Passover crowds',
  },
  {
    id: 11,
    nbhd: 'judea',
    name: 'Gethsemane',
    cat: 'passion',
    emoji: '🌿',
    address: 'Garden of Gethsemane, foot of the Mount of Olives, Jerusalem',
    lat: 31.7794, lng: 35.2397,
    search: 'Gethsemane ancient olive trees garden Jerusalem',
    note: 'The olive grove at the foot of the Mount of Olives where, in the novel, Ana finds her brother Judas the morning after the arrest, undone by guilt: he had gambled that Jesus would fight, and take up the revolution with him, and had been terribly wrong. Gethsemane is real, and some of the gnarled olive trees in the garden beside the Church of All Nations are among the oldest known. It is the book\'s quietest, darkest place, the hinge between the marriage and the cross.',
    book: 'The night of the arrest',
    visit: 'The garden beside the Church of All Nations is open to visitors; its ancient olive trees are the draw.',
    type: 'Ana and her brother Judas',
  },
  {
    id: 12,
    nbhd: 'judea',
    name: 'Golgotha',
    cat: 'passion',
    emoji: '✝️',
    address: 'Golgotha, Church of the Holy Sepulchre, Old City of Jerusalem',
    lat: 31.7784, lng: 35.2297,
    search: 'Church of the Holy Sepulchre Jerusalem old city dome',
    note: 'The place of the crucifixion, where the novel brings Ana to stand among the women, powerless, as Jesus dies, and where she joins them afterward to mourn and to prepare his body. Golgotha, "the place of the skull," is traditionally enclosed today within the Church of the Holy Sepulchre in the Old City, one of the most contested and revered sites in Christianity. The book stays close to Ana\'s grief here rather than to doctrine; it is the emotional summit of her whole journey.',
    book: 'The final chapters',
    visit: 'The Church of the Holy Sepulchre, in the Christian Quarter of the Old City, is open daily and often crowded; early morning is calmest.',
    type: 'Ana, Mary, and the women',
  },

  // ── EGYPT ─────────────────────────────────────────────────────────────────

  {
    id: 6,
    nbhd: 'egypt',
    name: 'Alexandria',
    cat: 'exile',
    emoji: '⛴️',
    address: 'Alexandria, Egypt (Mediterranean coast)',
    lat: 31.2001, lng: 29.8987,
    search: 'Alexandria Egypt harbour Mediterranean old city',
    note: 'The great sea-city of Egypt, and Ana\'s place of exile: when Galilee becomes too dangerous, she and Yaltha sail here to the house of their uncle Haran, who takes Ana in as a scribe but forbids her to leave or to search for the family she has lost. Alexandria was the second city of the Roman world, home to one of antiquity\'s largest Jewish communities and to the memory of its famous Library and lighthouse. The book uses its learning and its danger in equal measure; it is where Ana is most confined and, in the end, most free.',
    book: 'The middle chapters: Ana\'s flight to Egypt',
    visit: 'Modern Alexandria keeps its Greco-Roman layers, the catacombs of Kom el-Shoqafa and the new Bibliotheca Alexandrina echoing the ancient Library.',
    type: 'With Yaltha and their uncle Haran',
  },
  {
    id: 7,
    nbhd: 'egypt',
    name: 'The Temple of Isis',
    cat: 'exile',
    emoji: '🏺',
    address: 'Alexandria, Egypt (ancient site, position approximate)',
    lat: 31.2100, lng: 29.8850,
    search: 'Temple of Isis Egypt columns ancient sanctuary',
    note: 'The sanctuary where the novel places Diodora, the lost daughter Yaltha left behind in Egypt, now serving the priests of Isis. Ana and Yaltha seek her here, and are at first turned away. Isis, the great mother-goddess, was worshipped across Alexandria in the first century, and her temples were among the city\'s landmarks; but no single one survives intact and identified, so this marker is approximate by design. In a book about the divine feminine, and Ana\'s own turn toward Sophia, or Wisdom, the temple is more than a setting.',
    book: 'In Alexandria: the search for a lost cousin',
    noDirections: true,
    visit: 'The ancient temples of Isis in Alexandria are long gone; the marker is symbolic. Alexandria\'s Greco-Roman Museum gathers what remains of that world.',
    type: 'In search of Diodora, Yaltha\'s lost daughter',
  },
  {
    id: 8,
    nbhd: 'egypt',
    name: 'The Therapeutae, Lake Mareotis',
    cat: 'voice',
    emoji: '📖',
    address: 'A hill above Lake Mareotis, near Alexandria (ancient site, position approximate)',
    lat: 31.1000, lng: 29.8500,
    search: 'Lake Mareotis Mariout Alexandria reeds hills landscape',
    note: 'The refuge where Ana reaches the height of her life: a contemplative community of Jewish women and men who study, write and honour Wisdom, and among whom she finally composes her great work and, as an old woman, comes to lead. The Therapeutae were real, or at least the philosopher Philo of Alexandria described such a community on a hill above Lake Mareotis in his own century; their exact site has never been found, so this marker is approximate. It is where the book keeps its promise: here Ana becomes, fully, the voice her incantation bowl once prayed she would be, and here she buries her writings so that no man can silence them after her death.',
    book: 'Ana\'s years of refuge, writing, and return',
    noDirections: true,
    visit: 'A fictionalised setting drawn from Philo\'s account; the community\'s site is unidentified today. Lake Mariout still lies south-west of Alexandria.',
    type: 'Ana and Yaltha, among the Therapeutae',
  },

];
