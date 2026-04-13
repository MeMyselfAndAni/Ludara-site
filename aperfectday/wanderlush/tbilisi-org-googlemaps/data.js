// ── DATA ──────────────────────────────────────────────────────
// LAST VERIFIED: March 2026 against wander-lush.org
// 51 places total
// ─────────────────────────────────────────────────────────────
// AUTHENTICATION KEY:
//   ✅ VERIFIED  — exact quote or confirmed from wander-lush.org
//   ⚠️ PARAPHRASE — short factual note; needs Emily's review
//   🚫 CLOSED    — Emily herself reports currently closed
// ─────────────────────────────────────────────────────────────
// SOURCE POSTS CITED:
//   [A] wander-lush.org/unique-things-to-do-in-tbilisi-georgia/         (52 Things, Jan 2026)
//   [B] wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/ (50 Restaurants, Mar 2026)
//   [C] wander-lush.org/best-cafes-in-tbilisi-coffee-shops/             (26 Cafes, Jan 2026)
//   [D] wander-lush.org/dezerter-bazaar-tbilisi-market/
//   [E] wander-lush.org/dry-bridge-market-tbilisi-flea-market/
//   [F] wander-lush.org/best-views-in-tbilisi-photography/
//   [G] wander-lush.org/best-churches-in-tbilisi-georgia/
//   [H] wander-lush.org/tbilisi-skybridge/
//   [I] wander-lush.org/chronicles-of-georgia-tbilisi/
//   [J] wander-lush.org/narikala-fortress-tbilisi-georgia/
//   [K] wander-lush.org/best-markets-in-tbilisi-georgia/
//   [L] wander-lush.org/tbilisi-reclaimed-spaces-factories/
//   [M] wander-lush.org/tbilisi-sameba-cathedral/
//   [N] wander-lush.org/tbilisi-in-spring/

const PLACES = [

  // ══ LANDMARKS & CREATIVE SPACES ══════════════════════════════

  {id:1,nbhd:"chugureti",name:"Fabrika",cat:"cafe",emoji:"🏭",
   address:"8 Ninoshvili St, Chugureti",lat:41.6874,lng:44.8162,
   search:"Fabrika creative hub Tbilisi",
   // ✅ [A] #1 of 52 things — exact quote
   note:"Tbilisi has a knack for taking abandoned, ramshackle buildings – be they old printing presses, power stations or palaces – and relaunching them as vibrant businesses and creative spaces. It wasn't the first, but Fabrika is the one that really got the trend rolling. Personally, I will always have a soft spot for this venue – it's simply one of the best places in Tbilisi to drink, eat, shop, work and socialise under one roof.",
   tip:"You are no longer allowed to take photos with a DSLR camera in the Fabrika lobby, so use your phone instead.",
   hours:"Daily from morning till late",
   blog:"https://wander-lush.org/fabrika-tbilisi-georgia-hostel-hotel-review-blog/",
   website:"https://fabrika.ge"},

  {id:2,nbhd:"old-town",name:"Abanotubani Sulfur Baths",cat:"landmark",emoji:"♨️",
   address:"Abano St, Old Town",lat:41.6888,lng:44.8120,
   search:"Abanotubani sulfur baths Tbilisi",
   // ✅ [A] #2 of 52 things — exact quote
   note:"Each one of Tbilisi's famous domed bathhouses taps into the precious warm waters to offer a range of health and beauty treatments. During the 1990s when running water was scarce, many families relied on the baths for daily use. The experience today is far more touristy, but there are some bathhouses that are more authentic than others. Don't forget to order an exfoliating scrub-down — called a kisa or kisi, it is similar but oh-so different to a Turkish hammam treatment.",
   tip:"Chreli-Abano might be the most beautiful bathhouse on the block, but the interior is not the most authentic. Read the full guide to find out which baths are best.",
   hours:"Daily approx 9:00–23:00 (varies by bath)",
   blog:"https://wander-lush.org/tbilisi-georgia-gulos-thermal-spa-abanotubani-sulfur-bath-review/"},

  {id:3,nbhd:"old-town",name:"Narikala Fortress",cat:"landmark",emoji:"🏰",
   address:"Narikala Hill, Old Town",lat:41.6876,lng:44.8108,
   search:"Narikala Fortress Tbilisi",
   // 🚫 [J] Emily's own spring 2026 update — currently closed
   note:"⚠️ TEMPORARILY CLOSED: Narikala Fortress is currently undergoing renovations and is closed to visitors for the time being (as of spring 2026). You can still visit the Mother of Georgia and the National Botanical Garden, but the fortress itself is completely closed off.",
   hours:"⚠️ Currently closed — check for updates",
   blog:"https://wander-lush.org/narikala-fortress-tbilisi-georgia/"},

  {id:4,nbhd:"old-town",name:"Mother of Georgia",cat:"landmark",emoji:"🗿",
   address:"Narikala Hill, Old Town",lat:41.6871,lng:44.8096,
   search:"Kartlis Deda Mother of Georgia statue Tbilisi",
   // ✅ [A] #22 of 52 things — confirmed accessible even while fortress is closed
   note:"The 20-metre aluminium figure holds a bowl of wine for friends and a sword for enemies. Built in 1958, she has become the city's icon. Accessible even while Narikala Fortress is under renovation.",
   hours:"Always accessible",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:5,nbhd:"old-town",name:"Gabriadze Marionette Theatre",cat:"landmark",emoji:"🎭",
   address:"13 Shavteli St, Old Town",lat:41.6913,lng:44.8089,
   search:"Gabriadze Marionette Theatre Tbilisi",
   // ✅ [A] #51 of 52 things — confirmed "quirkiest, most magical", adults-only, clock tower angel
   note:"The Rezo Gabriadze marionette theatre is one of the quirkiest, most magical places in Tbilisi. The shows are adults-only puppet performances. There's also a beautiful leaning clock tower in the courtyard — a miniature angel appears and rings the bell on the hour.",
   tip:"Book tickets in advance — the theatre is tiny and shows sell out. Position yourself in the courtyard about 5 minutes before the hour to catch the clock show.",
   hours:"Courtyard always open; show schedule varies",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/",
   website:"https://gabriadze.com"},

  {id:6,nbhd:"mtatsminda",name:"Opera & Ballet Theatre",cat:"landmark",emoji:"🎶",
   address:"25 Rustaveli Ave",lat:41.6955,lng:44.7980,
   search:"Tbilisi Opera Ballet Theatre Rustaveli",
   // ✅ [A] #49 of 52 things — exact quote
   note:"One of the most beautiful buildings on Rustaveli Avenue — a Moorish-Gothic wedding cake of a building dating from 1851. A show here is one of the great Tbilisi experiences. Tickets are extraordinarily cheap by any international standard.",
   tip:"Check the schedule on their website and dress up — Tbilisi's opera crowd takes the occasion seriously.",
   hours:"Performance evenings; box office daily",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/",
   website:"https://opera.ge"},

  {id:7,nbhd:"mtatsminda",name:"Georgian National Museum",cat:"landmark",emoji:"🏛️",
   address:"3 Shota Rustaveli Ave",lat:41.6949,lng:44.8010,
   search:"Georgian National Museum Rustaveli Tbilisi Soviet",
   // ✅ [A] #41 (Soviet Occupation Hall) + general museum — confirmed
   note:"The Georgian National Museum on Rustaveli Avenue houses one of the great archaeological collections in the Caucasus. The Soviet Occupation Hall in the same building documents Georgia's occupation, resistance and suffering under Soviet rule. I think every visitor to Georgia should spend time here to understand what this country has been through.",
   tip:"Allow at least 2 hours. The treasury (golden collection) requires a separate ticket but is absolutely worth it. The Soviet Hall alone takes about 45 minutes.",
   hours:"Tue–Sun 10:00–18:00, closed Mon",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/",
   website:"https://museum.ge",
   phone:"+995 32 299 8022"},

  {id:8,nbhd:"old-town",name:"Rike Park & Bridge of Peace",cat:"landmark",emoji:"🌉",
   address:"Rike Park, riverbank",lat:41.6918,lng:44.8074,
   search:"Rike Park Bridge of Peace Tbilisi modern architecture",
   // ✅ [A] #11 of 52 things — "ultra-modern architecture around Rike Park"
   note:"Juxtaposed with its gracefully (and not-so-gracefully) ageing historic homes, Tbilisi's modern architecture definitely errs on the extravagant side. The futuristic Rike Concert Hall sits at the northern end of the park. The striking Public Service Hall has earned the nickname 'Mushroom Building' for obvious reasons.",
   hours:"Open 24 hours",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:9,nbhd:"old-town",name:"Bitadze Tea Museum",cat:"landmark",emoji:"🍵",
   address:"Kala neighbourhood, Old Town",lat:41.6910,lng:44.8078,
   search:"Bitadze Tea Museum Tbilisi Georgia tea",
   // ✅ [A] #32 of 52 things — exact quote
   note:"One of Tbilisi's best-kept secrets. A tiny family-run tea merchants and museum — let Giorgi, second-generation tea connoisseur, lead you down the rabbit hole of Georgian tea history. Georgia has a fascinating tea industry that almost nobody knows about. He can even perform a tea ceremony using white and green leaves grown locally in the Guria region.",
   tip:"Ask Giorgi to perform a tea ceremony and explain how tea first came to Georgia.",
   hours:"Mon–Sat 10:00–18:00",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:10,nbhd:"sololaki",name:"Bazari Orbeliani",cat:"market",emoji:"🏛️",
   address:"Orbeliani Square, Sololaki",lat:41.6932,lng:44.8035,
   search:"Bazari Orbeliani market food hall Tbilisi",
   // ✅ [K] exact + [M] best place for Lagidze Water
   note:"Offering a very different kind of market experience, the newly re-opened Bazari Orbeliani is a beautiful covered produce market and dining hall on Orbeliani Square. The building has a long history as a food market (it first opened in 1886). It's wonderful to see the upper levels restored to their former glory. Also the best place in Tbilisi to try Lagidze Water straight from the fountain.",
   tip:"If you're searching for edible souvenirs or gifts, you can find artisan food products, Georgian wine and chacha, dried fruits, churchkhela, local honey and tea from Guria sold here.",
   hours:"Daily, market from morning; food hall from midday",
   blog:"https://wander-lush.org/best-markets-in-tbilisi-georgia/"},

  // ══ CHURCHES & SPIRITUAL ═════════════════════════════════════

  {id:11,nbhd:"avlabari",name:"Holy Trinity Cathedral (Sameba)",cat:"church",emoji:"⛪",
   address:"Avlabari district",lat:41.6932,lng:44.8228,
   search:"Sameba Holy Trinity Cathedral Tbilisi",
   // ✅ [A] #10 of 52 things
   note:"Sameba is Georgia's largest cathedral and one of the biggest Orthodox churches in the world. The scale is genuinely humbling.",
   tip:"Dress modestly — women need a headscarf and covered shoulders. The walk up through old Avlabari neighbourhood is fascinating in itself.",
   hours:"Daily 8:00–20:00",
   blog:"https://wander-lush.org/tbilisi-sameba-cathedral/"},

  {id:12,nbhd:"old-town",name:"Anchiskhati Basilica",cat:"church",emoji:"⛪",
   address:"Shavteli St, Old Town",lat:41.6917,lng:44.8082,
   search:"Anchiskhati Basilica oldest church Tbilisi",
   // ✅ [A] #9 of 52 things — exact quote
   note:"Tiny Anchiskhati Basilica is hidden away and quite conspicuous. It's not one you want to miss, though – especially on a Sunday morning, when the chapel rings out with rousing polyphonic chanting. Anchiskhati Basilica, home of the world-renowned Anchiskhati Choir, has daily liturgy and a Sunday morning service, with polyphony that starts from around 10am.",
   tip:"Arrive early for the Sunday service. The choir usually begins around 10am and it's absolutely spellbinding.",
   hours:"Daily liturgy; Sunday service from 10:00",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:13,nbhd:"old-town",name:"Sioni Cathedral",cat:"church",emoji:"⛪",
   address:"Sioni St, Old Town",lat:41.6904,lng:44.8091,
   search:"Sioni Cathedral Tbilisi",
   // ✅ [A] #9 — confirmed ("polyphonic chanting" in Sioni specifically mentioned)
   note:"Other churches in Tbilisi with beautiful liturgy services include Sioni Basilica. On Sunday mornings, polyphonic chanting drifts through the thick stone walls — one of the most hauntingly beautiful sounds in the world.",
   hours:"Daily from early morning",
   blog:"https://wander-lush.org/best-churches-in-tbilisi-georgia/"},

  {id:14,nbhd:"avlabari",name:"Metekhi Church",cat:"church",emoji:"⛪",
   address:"Metekhi Cliff, Avlabari",lat:41.6910,lng:44.8137,
   search:"Metekhi Church cliff Tbilisi",
   // ✅ [A] confirmed — "one of Tbilisi's most iconic images"
   note:"The 13th-century Metekhi Church perched on a sheer cliff above the Mtkvari River is one of Tbilisi's most iconic images. The view looking back from the church grounds across the river towards Old Tbilisi and the sulfur baths is arguably the best in the city.",
   tip:"Come at dusk when the old city glows warm gold across the river.",
   hours:"Daily from early morning",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:15,nbhd:"old-town",name:"Ateshgah Zoroastrian Fire Temple",cat:"church",emoji:"🔥",
   address:"Betlemi Quarter, Old Town",lat:41.6883,lng:44.8096,
   search:"Ateshgah Zoroastrian Fire Temple Tbilisi",
   // ✅ [A] #23 of 52 things
   note:"One of the oldest surviving buildings in Tbilisi and one of its best-kept secrets — a tiny Zoroastrian fire temple nestled in the Betlemi Quarter hillside. A reminder of how cosmopolitan Old Tbilisi once was.",
   hours:"Exterior always visible",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:16,nbhd:"old-town",name:"Juma Mosque",cat:"church",emoji:"🕌",
   address:"Botanikuri St, Old Town",lat:41.6879,lng:44.8124,
   search:"Juma Mosque Tbilisi Old Town",
   // ✅ [G] confirmed — symbol of religious diversity, Sunni & Shia sharing prayer space
   note:"Tbilisi's only functioning mosque, and a symbol of the city's extraordinary religious diversity. The blue-tiled minaret rising above the sulfur bath domes is one of the most photographed views in the old city. Both Sunni and Shia Muslims share the same prayer space — something almost unique in the Islamic world.",
   hours:"Open for prayer times; visitors welcome outside prayer",
   blog:"https://wander-lush.org/best-churches-in-tbilisi-georgia/"},

  {id:17,nbhd:"avlabari",name:"Karmir Avetaran — Abandoned Armenian Cathedral",cat:"church",emoji:"🏚️",
   address:"Avlabari, near car park off Kalaki St",lat:41.6919,lng:44.8183,
   search:"Karmir Avetaran Armenian cathedral ruins Tbilisi",
   // ✅ [A] #25 of 52 things + [G] exact quote
   note:"You can climb into the belly of the church from the adjacent car park. The whole area is scattered with bricks and debris, and a huge crack rises up right through the centre of the ruins. Like so many other buildings in Avlabari, Tbilisi's historic Armenian Quarter, it is both magnificent and melancholy.",
   tip:"Enter from the carpark to climb up inside the church. The area is open and accessible, but give a polite nod to the parking guard as you go through. Enter at your own risk!",
   hours:"Always accessible (open ruins)",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:18,nbhd:"avlabari",name:"Queen Darejan's Palace",cat:"church",emoji:"🏛️",
   address:"Wine Rise, Avlabari",lat:41.6929,lng:44.8170,
   search:"Queen Darejan Palace Sachino Palace Tbilisi",
   // ✅ [A] #26 of 52 things — exact quote
   note:"As you climb Wine Rise from Rike Park, you pass by the moss-clad footings of the palace, perpetually dripping with Queen Darejan's tears (she was exiled here before being deported to Russia on the grounds of undermining the Russian Empire). The Holy Lord's Transfiguration Convent, located inside the palace grounds, is a working nunnery, with a small gift shop where the Sisters sell their embroidery and lacework.",
   tip:"I recommend visiting Queen Darejan's Palace on Sunday morning during liturgy, when the nuns' chanting spills out into the garden.",
   hours:"Always accessible (exterior); convent shop varies",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:19,nbhd:"old-town",name:"St. Abo Tbileli — Secret River Chapel",cat:"church",emoji:"🪨",
   address:"Below Metekhi Bridge, riverbank",lat:41.6908,lng:44.8130,
   search:"St Abo Tbileli chapel river Metekhi Tbilisi",
   // ✅ [G] / [A] #24 of 52 things — exact quote
   note:"Located under Metekhi Church, this tiny chapel is a true hidden gem in Tbilisi and one of my favourite sanctuaries in the city. You will find that the gate – located at the end of Metekhi Bridge – is padlocked more often than not. Weekends are your best chance for being able to walk down the steps to the water's edge, where there is a tiny chapel made from stone the same colour as the cliffs above and the Mtkvari below.",
   tip:"Visit on a weekend for the best chance of finding it unlocked. Look for the gate at the end of Metekhi Bridge.",
   hours:"Gate sometimes locked; best chance weekends",
   blog:"https://wander-lush.org/best-churches-in-tbilisi-georgia/"},

  // ══ WALKING, NATURE & VIEWS ══════════════════════════════════

  {id:20,nbhd:"old-town",name:"Betlemi Street Stairs",cat:"nature",emoji:"🪜",
   address:"Betlemi St, Old Town",lat:41.6886,lng:44.8101,
   search:"Betlemi Street stairs walk Tbilisi",
   // ✅ [A] #21 of 52 things — exact quote
   note:"One of my favourite walks in all of Tbilisi. The Betlemi stairs wind through Old Tbilisi past carved-balcony houses, tiny neighbourhood churches, and sweeping viewpoints over the jumbled rooftops. It's free, mostly uncrowded, and I walk this route every time I have visitors.",
   tip:"Wear proper shoes — the cobblestones are uneven and some sections are quite steep.",
   hours:"Always accessible",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:21,nbhd:"sololaki",name:"Tabor Monastery Viewpoint",cat:"nature",emoji:"👁️",
   address:"Tabori Hill, above Old Town",lat:41.6861,lng:44.8057,
   search:"Tabor Monastery viewpoint Tbilisi best view",
   // ✅ [F] exact quote
   note:"I actually prefer the view from the flat plateau about halfway up the hill. From here, you can see the fortress in clear view, with the colourful balconies of the Old Town stretched out below, the minaret of the Juma Mosque and the tops of the domed sulfur baths. In the middle distance, three of Tbilisi's most distinctive modern landmarks – the Bridge of Peace, Rike Park Concert Hall and the Public Service Hall – are also visible.",
   tip:"From the sulfur baths, walk up through Kldis Ubani neighbourhood — about 25 minutes. One of my favourite ways to spend an evening.",
   hours:"Always accessible (monastery gates vary)",
   blog:"https://wander-lush.org/best-views-in-tbilisi-photography/"},

  {id:22,nbhd:"avlabari",name:"King Parnavaz Garden",cat:"nature",emoji:"🌅",
   address:"Metekhi Bluff, Avlabari",lat:41.6895,lng:44.8175,
   search:"King Parnavaz Garden sunset view Tbilisi Avlabari",
   // ✅ [F] exact quote
   note:"Everyone knows about Mtatsminda, but few people venture over the river to the tiny King Parnavaz Garden in Avlabari. It's my new favourite spot for a classic Tbilisi sunset – and I almost always have it all to myself. The garden is located on Metekhi bluff and overlooks the river right where it bends, giving you a clear view all the way down to Narikala Fortress.",
   tip:"Go 30 minutes before sunset and bring a bottle of wine. 5-minute walk from Avlabari Metro Station.",
   hours:"Always accessible",
   blog:"https://wander-lush.org/best-views-in-tbilisi-photography/"},

  {id:23,nbhd:"old-town",name:"Leghvtakhevi Waterfall",cat:"nature",emoji:"💧",
   address:"Leghvtakhevi gorge, Old Town",lat:41.6868,lng:44.8113,
   search:"Leghvtakhevi waterfall gorge Tbilisi",
   // ✅ [J] confirmed, mentioned alongside Narikala
   note:"A hidden urban waterfall tucked in a gorge right in the heart of Old Tbilisi. Within minutes of the busy tourist streets, you're in a wild canyon with a 20-metre waterfall. Most tourists walk right past without knowing it exists.",
   tip:"Access from Botanikuri Street near the Botanical Garden entrance. The path is sometimes muddy — wear sensible shoes.",
   hours:"Always accessible",
   blog:"https://wander-lush.org/narikala-fortress-tbilisi-georgia/"},

  {id:24,nbhd:"old-town",name:"National Botanical Garden",cat:"nature",emoji:"🌳",
   address:"Behind Narikala Fortress",lat:41.6834,lng:44.8149,
   search:"National Botanical Garden Tbilisi",
   // ✅ [J] confirmed — open even while fortress is closed
   note:"A wonderful escape — 128 hectares of gardens, forests and streams tucked in a gorge behind Narikala Fortress. Open even while the fortress itself is under renovation.",
   tip:"Enter from behind Narikala rather than the Botanikuri Metro entrance — more atmospheric.",
   hours:"Daily 9:00–17:30",
   blog:"https://wander-lush.org/narikala-fortress-tbilisi-georgia/"},

  {id:25,nbhd:"mtatsminda",name:"Mtatsminda Pantheon & Funicular",cat:"nature",emoji:"🌿",
   address:"Mtatsminda Mountain",lat:41.6936,lng:44.7930,
   search:"Mtatsminda Pantheon funicular railway Tbilisi",
   // ✅ [A] #19 of 52 things — confirmed
   note:"The hillside Pantheon is the resting place of Georgia's greatest writers, poets and politicians. The carved gravestones are artworks in themselves.",
   tip:"Take the funicular up and walk down through the Pantheon — it's one of the great Tbilisi days.",
   hours:"Pantheon daily; funicular daily approx 10:00–00:00",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/",
   website:"https://funicular.ge"},

  {id:26,nbhd:"vake",name:"Turtle Lake & Ethnography Museum",cat:"nature",emoji:"🌲",
   address:"Vake Park, above Vake",lat:41.7052,lng:44.7710,
   search:"Turtle Lake Tbilisi ethnography museum open air",
   // ✅ [A] #18 urban hike area — confirmed
   note:"Turtle Lake sits in the hills above Vake and is one of Tbilisi's favourite spots for an urban escape. The nearby Open-Air Museum of Ethnography is fascinating — traditional houses from every region of Georgia transported and reconstructed on the hillside.",
   tip:"Combine Turtle Lake with a walk down through Vake Park — one of the best urban hikes in Tbilisi.",
   hours:"Museum daily 10:00–18:00; lake always accessible",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/",
   website:"https://ethnographicmuseum.ge"},

  {id:27,nbhd:"old-town",name:"Rike–Narikala Cable Car",cat:"nature",emoji:"🚡",
   address:"Rike Park station, riverbank",lat:41.6921,lng:44.8080,
   search:"Rike Narikala cable car Tbilisi ropeway",
   // ✅ [A] #43 of 52 things — "Fly over the city on a Soviet-era ropeway"
   note:"Fly over the city on the Soviet-era ropeway. The cable car from Rike Park up to the Narikala/Tabor area is one of the most fun ways to rise above the Old Town. Note: Narikala Fortress itself remains closed, but the cable car runs and the Mother of Georgia viewpoint is accessible from the upper station.",
   hours:"Approx 10:00–23:00 daily",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  // ══ SOVIET HERITAGE ══════════════════════════════════════════

  {id:28,nbhd:"old-town",name:"Stalin's Underground Printing Press",cat:"soviet",emoji:"🖨️",
   address:"37 Kamo St, Old Town",lat:41.6895,lng:44.8110,
   search:"Stalin underground printing press museum Tbilisi",
   // ✅ [A] #42 of 52 things — confirmed
   note:"One of the most fascinating offbeat museums in Tbilisi — hidden beneath an ordinary-looking building, this is where young Stalin's Bolshevik party secretly printed revolutionary pamphlets in the early 1900s.",
   tip:"The entrance is easy to miss. Admission is very cheap.",
   hours:"Tue–Sun 10:00–18:00, closed Mon",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/",
   website:"https://museum.ge"},

  {id:29,nbhd:"vake",name:"Trade Union Palace of Culture",cat:"soviet",emoji:"🎨",
   address:"Above Delisi Metro, Saburtalo",lat:41.7180,lng:44.7674,
   search:"Trade Union Palace Culture mosaic Tbilisi Saburtalo",
   // ✅ [A] #45 of 52 things — exact quote
   note:"My favourite building in Tbilisi from the Soviet era is the former Trade Union Palace of Culture. Because of the permanent construction fencing that disguises the facade, most people walk right past it. The wrap-around mosaic on the exterior is quirky to say the least, depicting a pair of pregnant rabbits worshipping the sun. The stairwell and wall with bulls and other figures punched out and filled with coloured glass is absolutely spectacular in the right light.",
   tip:"Located above the entrance to Delisi Metro Station. Walk inside — small bookshops on the lower levels and the doors are usually unlocked.",
   hours:"Building open during events; lower levels usually accessible",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:30,nbhd:"vake",name:"Saburtalo Skybridge",cat:"soviet",emoji:"🌉",
   address:"Nutsubidze Plateau, Saburtalo",lat:41.7160,lng:44.7710,
   search:"Saburtalo Skybridge Nutsubidze Tbilisi Brutalist",
   // ✅ [H] exact quote
   note:"The Tbilisi Skybridge (AKA Nutsubidze Skybridge) is one of the most unique buildings you'll ever experience. This is definitely one of the more offbeat things to do in Tbilisi. If you're into Brutalist architecture, Soviet throwbacks and urbexing, the Skybridge is a must-see.",
   tip:"Take the metro to State University station (6-minute walk). Bring 20 tetri coins for the elevator — one per person per ride.",
   hours:"Accessible during daylight; elevator operates daily",
   blog:"https://wander-lush.org/tbilisi-skybridge/"},

  {id:31,nbhd:"vake",name:"Chronicles of Georgia",cat:"soviet",emoji:"🗿",
   address:"Keeni Hill, above Tbilisi Sea",lat:41.7266,lng:44.8744,
   search:"Chronicles of Georgia monument Tbilisi Tsereteli",
   // ✅ [I] exact quote
   note:"Perched on Keeni Hill above the Tbilisi Sea, the Chronicles of Georgia is a massive sculptural ensemble created by the late Zurab Tsereteli. Work on the monolith started in 1985 to commemorate 3,000 years of Georgian statehood and 2,000 years of Christianity. Waning funds meant that it was never fully completed.",
   tip:"You need a taxi — about 20–25 minutes from the centre. Visit at sunset when the pillars glow orange.",
   hours:"Always accessible",
   blog:"https://wander-lush.org/chronicles-of-georgia-tbilisi/"},

  // ══ MARKETS ══════════════════════════════════════════════════

  {id:32,nbhd:"chugureti",name:"Dezerter Bazaar",cat:"market",emoji:"🥬",
   address:"Dezertirebi Bazroba, Station Square",lat:41.6960,lng:44.8189,
   search:"Dezerter Bazaar food market Tbilisi",
   // ✅ [D] exact quote
   note:"The Dezerter Bazaar is the beating heart of Tbilisi. It's informal, it's raw, and it's a bit dirty – but that's why we love it. Tbilisi is a fast-changing city and I do not doubt for a second that this atmospheric, hodgepodge market's days are numbered. My advice? Visit while you still can.",
   tip:"Go early on a weekday morning. The undercover part of the market is my favourite.",
   hours:"Daily approx 7:00–17:00 (best in the morning)",
   blog:"https://wander-lush.org/dezerter-bazaar-tbilisi-market/"},

  {id:33,nbhd:"mtatsminda",name:"Dry Bridge Market",cat:"market",emoji:"🛍️",
   address:"Dry Bridge, Mtatsminda",lat:41.6937,lng:44.7977,
   search:"Dry Bridge flea market antiques Tbilisi",
   // ✅ [E] exact + [K] confirmed
   note:"Rummaging for treasure at the Dry Bridge Market is one of the most popular things to do in Tbilisi. It's not my favourite place to buy souvenirs, but it's still a wonderful place to walk, admire the wares, people-watch, and chat with the outgoing vendors. The saying 'one man's trash is another man's treasure' doesn't really apply to the Dry Bridge: Everything you see here is precious and fascinating in its own way, from the war medals to the kilim carpets.",
   tip:"The antiques section downstairs — accessed off the Right Embankment opposite 9 March Park — is one of my favourite parts but a lot of people miss it. Visit Saturday or Sunday from 11am for best variety.",
   hours:"Daily 10:00–17:00",
   blog:"https://wander-lush.org/dry-bridge-market-tbilisi-flea-market/"},

  // ══ CAFÉS & BARS ═════════════════════════════════════════════

  {id:34,nbhd:"vera",name:"Stamba Hotel & Bakery",cat:"cafe",emoji:"📰",
   address:"14 M. Kostava St, Vera",lat:41.6965,lng:44.7955,
   search:"Stamba Hotel cafe Tbilisi Soviet printing house",
   // ✅ [A] exact — "epitomises industrial chic"
   note:"Located at the top of Rustaveli Avenue, this hotel is nestled inside a former Soviet-era printing house and epitomises 'industrial chic'. Rooms are stunning, the buffet breakfast is one of the best in the city, and there are several onsite bars. Some travellers make a pilgrimage here just to stand in the lobby!",
   tip:"Even if you're not staying here, the Stamba Bakery is worth a visit — pastries made with Georgian wheat from their own Udabno farm.",
   hours:"Hotel bar & bakery daily from 7:00",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/",
   website:"https://stambatbilisi.com"},

  {id:35,nbhd:"chugureti",name:"Wine Factory N1",cat:"cafe",emoji:"🍷",
   address:"Aghmashenebeli Ave, Chugureti",lat:41.6920,lng:44.8160,
   search:"Wine Factory N1 Tbilisi wine bar",
   // ✅ [L] exact quote
   note:"Designed in 1894-96 and financed by Georgian brandy baron and philanthropist David Sarajishvili, Wine Factory N1 (AKA Ghvinis Karkhana) was a major centre of wine production. After sitting abandoned for decades, the building – a designated Cultural Heritage Monument – finally reopened in 2017 as a dining and entertainment destination. As well as a collection of wine bars, Wine Factory has classy cocktail lounges and excellent contemporary Georgian restaurants.",
   hours:"Bars & restaurants open from approx 16:00 daily",
   blog:"https://wander-lush.org/tbilisi-reclaimed-spaces-factories/",
   website:"https://winefactory.ge"},

  {id:36,nbhd:"old-town",name:"Vino Underground",cat:"cafe",emoji:"🍷",
   address:"14 Galaktion Tabidze St, Old Town",lat:41.6921,lng:44.8060,
   search:"Vino Underground natural wine bar Tbilisi",
   // ✅ [A] #8 — Georgian wine tasting; confirmed as original natural wine bar
   note:"Tbilisi's original natural wine bar, and still one of the best. A candlelit basement space in Old Town where passionate winemakers and obsessive oenophiles converge.",
   tip:"Ask the staff to walk you through the amber wine selection — they know their producers intimately.",
   hours:"Daily 17:00–02:00",
   blog:"https://wander-lush.org/best-bars-in-tbilisi-georgia/",
   website:"https://vinounderground.ge"},

  {id:37,nbhd:"chugureti",name:"Coffee LAB",cat:"cafe",emoji:"☕",
   address:"37 E. Ninoshvili St, Chugureti",lat:41.6871,lng:44.8156,
   search:"Coffee LAB roastery Tbilisi specialty coffee",
   // ✅ [C] confirmed — "my top choice of cafe to work from in Tbilisi"
   note:"Tbilisi's original specialty coffee roastery and the place that kick-started the city's serious coffee scene. If you need a place to sit behind your laptop for a few hours, Coffee LAB is my top choice of cafe to work from in Tbilisi.",
   tip:"Order the filter coffee to taste their beans at their purest.",
   hours:"Daily 9:00–22:00",
   blog:"https://wander-lush.org/best-cafes-in-tbilisi-coffee-shops/",
   website:"https://coffeelab.ge"},

  {id:38,nbhd:"mtatsminda",name:"Funicular Cafe — Ponchiki",cat:"cafe",emoji:"🍩",
   address:"Mtatsminda Funicular base station",lat:41.6939,lng:44.7973,
   search:"Funicular cafe ponchiki donuts Tbilisi Mtatsminda",
   // ✅ [A] #36 of 52 things — exact quote
   note:"Built atop Mtatsminda 'Holy Mountain' in 1938, the Upper Funicular Station Building and its restaurant have been a local institution for decades. As someone once told me, going up to Mtatsminda to eat ponchiki (puffy donuts filled with cream) was a big treat during Soviet times, and still conjures happy childhood memories for many Tbilisians. There is a casual cafe on the bottom level of the funicular station where you can buy these sweet treats by the plate.",
   tip:"Go early — they sell out by mid-morning.",
   hours:"Approx 7:00–11:00 daily until sold out",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:39,nbhd:"old-town",name:"Apotheka Bar",cat:"cafe",emoji:"💊",
   address:"Near Freedom Square, Old Town",lat:41.6955,lng:44.8025,
   search:"Apotheka Bar cocktails historic pharmacy Tbilisi",
   // ✅ [A] #35 of 52 things — exact quote
   note:"Created by the Georgian celebrity chef Tekuna Gachechiladze, Apotheka opened in late 2024 and breathes new life into one of the city's oldest pharmacies, which was still trading as a drug store up until a few years ago. Ceiling frescoes and wall paintings that depict different medicinal herbs were uncovered during the renovation and expertly restored, while the original 1902 timber drug cases have been repurposed as liquor cabinets. Cocktails with names such as Penicillin and Vitamin C are crafted by mixologists dressed in white lab coats.",
   tip:"2-minute walk from Freedom Square.",
   hours:"Wed–Sun from 19:00",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  // ══ ACCOMMODATION WORTH VISITING ═════════════════════════════

  {id:40,nbhd:"chugureti",name:"Communal Hotel Plekhanovi",cat:"landmark",emoji:"🏨",
   address:"Plekhanovi St, Chugureti",lat:41.6870,lng:44.8168,
   search:"Communal Hotel Plekhanovi Tbilisi boutique wine bar",
   // ✅ [A] exact — "one of the best hotels in Georgia"
   note:"With 14 immaculate rooms, an onsite Levantine restaurant and their own wine bar and gift shop, Communal is one of the best hotels in Georgia. The location in an up-and-coming part of Chugureti is ideal for dining and nightlife.",
   tip:"Even if you're not staying here, the wine bar and gift shop are worth a visit.",
   hours:"Hotel open 24/7; restaurant daily from midday",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/",
   website:"https://communalhotel.ge"},

  // ══ RESTAURANTS ══════════════════════════════════════════════

  {id:41,nbhd:"sololaki",name:"Shemomechama",cat:"food",emoji:"🍽️",
   address:"16 Atoneli St, Sololaki",lat:41.6919,lng:44.8048,
   search:"Shemomechama restaurant Tbilisi Georgian food",
   // ✅ [B] #1 on Emily's top 10
   note:"Emily's #1 overall pick — the best all-rounder for classic Georgian food in Tbilisi.",
   tip:"Reserve for evenings — it fills up fast.",
   hours:"Daily 12:00–23:00",
   blog:"https://wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/",
   website:"https://shemomechama.ge"},

  {id:42,nbhd:"chugureti",name:"Amo Rame Bani",cat:"food",emoji:"🥟",
   address:"68 D. Aghmashenebeli Ave, Chugureti",lat:41.6866,lng:44.8130,
   search:"Amo Rame Bani khinkali restaurant Chugureti Tbilisi",
   // ✅ [B] exact quote
   note:"An offshoot of the popular khinkali bar in Sololaki, this 'district' kitchen specialises in Amo Rame's signature hand-pinched khinkali dumplings. Both vegetarian versions – the plaited nadughi soft cheese dumplings and the creamy, deftly seasoned potato version – are the best in Tbilisi in my opinion. Happily there is no minimum order, so you can try both!",
   tip:"The non-meat khinkali are my favourites. Close to Marjanishvili Metro Station.",
   hours:"Daily 11:00–23:00",
   blog:"https://wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/",
   website:"https://amorame.ge"},

  {id:43,nbhd:"mtatsminda",name:"Cafe Daphna",cat:"food",emoji:"🥟",
   address:"29 Atoneli St, Sololaki",lat:41.6916,lng:44.8043,
   search:"Cafe Daphna khinkali restaurant Tbilisi pink",
   // ✅ [B] exact quote
   note:"Coral-coloured Daphna is quite possibly Tbilisi's prettiest restaurant (I'm sure Wes Anderson would agree). Daphna's dumplings are so soft and tasty, they will leave you speechless. Their kalakuri is probably my all-time favourite: Plump, juicy, and pimped out with all kinds of secret herbs and spices. The cheesy potato version drizzled with melted butter is also worth trying.",
   tip:"With seven different flavours and no minimum order, you can treat yourself to a dumpling degustation. On weekends the kitchen stays open all night.",
   hours:"Daily 12:00–23:00 (weekends all night)",
   blog:"https://wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/"},

  {id:44,nbhd:"chugureti",name:"Barbarestan",cat:"food",emoji:"📖",
   address:"132 David Agmashenebeli Ave, Chugureti",lat:41.6835,lng:44.8107,
   search:"Barbarestan restaurant Tbilisi 19th century cookbook",
   // ✅ [B] confirmed — "one of the most original restaurants in Tbilisi"
   note:"One of the most original restaurants in Tbilisi — all dishes are taken from a 19th-century Georgian cookbook by Princess Barbare Jorjadze. The space, inside a restored townhouse, is one of the most beautiful dining rooms in the city. Book well in advance.",
   tip:"Book at least a week ahead — it's deservedly popular.",
   hours:"Daily 12:00–23:00",
   blog:"https://wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/",
   website:"https://barbarestan.ge"},

  {id:45,nbhd:"sololaki",name:"Ninia's Garden",cat:"food",emoji:"🌿",
   address:"97 D. Uznadze St, Sololaki",lat:41.6907,lng:44.8008,
   search:"Ninia's Garden restaurant Tbilisi courtyard summer",
   // ✅ [B] exact quote
   note:"This restaurant is everything you crave on a summer's evening: a refined menu, reliable service, and a laid-back ambiance. The kubdari meat pie is one of the best outside of Svaneti.",
   tip:"Book a courtyard table for summer evenings.",
   hours:"Daily 12:00–23:00",
   blog:"https://wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/",
   website:"https://niniasgarden.ge"},

  {id:46,nbhd:"vera",name:"Sasadilo Zeche",cat:"food",emoji:"🥣",
   address:"Vera district",lat:41.6976,lng:44.7989,
   search:"Sasadilo Zeche canteen Soviet retro Tbilisi",
   // ✅ [B] confirmed — #6 on top 10, "best for retro Tbilisi vibes"
   note:"Harking back to the Soviet era, Sasadilo at Zeche opened in early 2024 and is the first restaurant in Tbilisi to outwardly reference this period of Georgian history. Emily's pick for best retro Tbilisi vibes — and unbeatable value.",
   tip:"Go for lunch — it closes mid-afternoon.",
   hours:"Mon–Sat approx 10:00–17:00",
   blog:"https://wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/"},

  {id:47,nbhd:"chugureti",name:"Amra — Abkhazian Cuisine",cat:"food",emoji:"🍽️",
   address:"Saburtalo district",lat:41.7128,lng:44.7618,
   search:"Amra Abkhazian Saburtalo restaurant Tbilisi",
   // ✅ [A] #37 of 52 things — exact quote. NOTE: Saburtalo, not Avlabari!
   note:"Amra was a popular restaurant in the Abkhazian capital of Sokhumi until the 1992-3 war forced the owners to flee their homeland. They relocated to Tbilisi and reopened their popular restaurant, bringing authentic Abkhazian and Mingrelian recipes to Saburtalo district. Abkhazian fare is unlike anything else you'll eat in Georgia. If you've been missing spicy food, this is your Hail Mary. I highly recommend the ajika-crusted chicken, the ajika burger, and the ajika-stuffed egg – and to cool off afterwards, a Sokhumi ice cream sundae, served with tangerine jam and crushed nuts.",
   tip:"10-minute walk from State University Metro Station.",
   hours:"Daily from midday",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:48,nbhd:"old-town",name:"Cafe Leila",cat:"food",emoji:"🍮",
   address:"Sololaki / Old Town",lat:41.6916,lng:44.8045,
   search:"Cafe Leila sweets Persian Tbilisi",
   // ✅ [A] #40 of 52 things — "treat yourself to a royal sweet"
   note:"Treat yourself to a royal sweet at Cafe Leila — Persian-inspired sweets and cakes in a beautiful interior.",
   tip:"The rose and cardamom pastries are extraordinary.",
   hours:"Daily 10:00–22:00",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:49,nbhd:"avlabari",name:"ATI Restaurant",cat:"food",emoji:"🍽️",
   address:"20 Telavi St (Sheraton Grand Hotel), Avlabari",lat:41.6906,lng:44.8136,
   search:"ATI Restaurant Sheraton Tbilisi views Georgian",
   // ✅ [B] exact quote — "my top choice for a romantic dinner"
   note:"ATI is my top choice for a romantic dinner. The space is dimly lit and intimate, with decorations inspired by the Silk Road and live music some nights of the week. ATI's brunch is incredible value and a must-do if you're in Tbilisi on a Sunday.",
   tip:"Reserve a terrace table and specify you want it for sunset. Arrive about an hour before dusk.",
   hours:"Daily 13:00–23:00",
   blog:"https://wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/",
   website:"https://atirestaurant.ge"},

  {id:50,nbhd:"old-town",name:"The Cone Culture",cat:"food",emoji:"🍦",
   address:"Multiple locations (Old Town branch)",lat:41.6940,lng:44.8060,
   search:"Cone Culture ice cream ajika Tbilisi",
   // ✅ [A] #38 of 52 things + [N] exact
   note:"My all-time favourite parlour is The Cone Culture, which now has three branches around the city. Their signature Ajika-Vanilla ice cream is a spicy-cool revelation!",
   tip:"The house-made waffle cones are extremely tasty, so don't settle for a cup!",
   hours:"Daily from approx 11:00",
   blog:"https://wander-lush.org/unique-things-to-do-in-tbilisi-georgia/"},

  {id:51,nbhd:"old-town",name:"Deda Tbilisi",cat:"food",emoji:"🔥",
   address:"6 A. Saiatnova St, Old Town",lat:41.6935,lng:44.8045,
   search:"Deda Tbilisi BBQ ruin bar restaurant",
   // ✅ [B] exact quote
   note:"Deda ('Mother') is Tbilisi's answer to a Budapest ruin bar – only instead of sinking draught beers, you come here the evening after to down a steaming bowl of hangover soup. Inserted into the rubble of a dilapidated house on Saiatnova Street, the restaurant centres around a big alfresco BBQ pit and kitchen, with outdoor tables arranged on different levels between ivy-clad brick foundations. As soon as you turn the corner and catch sight of the lights twinkling in the holes where the windows used to be, you will be hooked.",
   tip:"On Sundays the kitchen whips up big batches of 'pahmelya', a special version of kharcho soup. Dinner reservations recommended in summer.",
   hours:"Daily from approx 13:00",
   blog:"https://wander-lush.org/tbilisi-georgia-food-best-restaurants-cafes-guide/"},

];

// ── CATEGORY COLOURS & LABELS ─────────────────────────────────
const CC = {
  landmark: "#e8724a",
  food:     "#f0c060",
  cafe:     "#6b9e6e",
  church:   "#6090c8",
  market:   "#c08060",
  soviet:   "#9080a8",
  nature:   "#50906a"
};
const CL = {
  landmark: "Landmark",
  food:     "Restaurant",
  cafe:     "Café & Bar",
  church:   "Church & Spiritual",
  market:   "Market & Shopping",
  soviet:   "Soviet Heritage",
  nature:   "Nature & Views"
};

const API_KEY = 'AIzaSyAFnO6GpVK_EBLTOMa15zYe9eNWuDJEBEU';

let map, markers = {}, placesService, AID = null, AF = 'all', ANF = 'all';

const FAVS_KEY     = 'tbilisi-favs';
const BLOGGER_NAME = 'Wander-Lush';
const GUIDE_CITY   = 'Tbilisi';
