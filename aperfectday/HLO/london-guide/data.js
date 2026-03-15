// ── LONDON DATA — Hand Luggage Only ───────────────────────────
// 50 places sourced from handluggageonly.co.uk
// Each place: id, nbhd, name, cat, emoji, address, lat, lng,
//             note (Yaya & Lloyd's voice), hours, tip, blog, phone, website
// ──────────────────────────────────────────────────────────────

const PLACES = [

  // ── LANDMARKS & ICONIC SIGHTS ─────────────────────────────
  {id:1,nbhd:"west-end",name:"British Museum",cat:"landmark",emoji:"🏛️",
   address:"Great Russell St, Bloomsbury WC1B 3DG",lat:51.5194,lng:-0.1270,
   note:"Honestly, we could spend weeks here and still not cover it all. One of the world's most incredible free museums — the scale of human history packed under one roof is staggering. Don't miss the Rosetta Stone, the Egyptian mummies, and the jaw-dropping Great Court. We love it equally on a drizzly London morning or a golden summer afternoon.",
   hours:"Daily 10:00–17:00 (Fri until 20:30)",tip:"Arrive at opening time on a weekday — the Great Court is breathtaking before the crowds arrive.",type:"World-class free museum",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.britishmuseum.org"},

  {id:2,nbhd:"west-london",name:"Natural History Museum",cat:"landmark",emoji:"🦕",
   address:"Cromwell Rd, South Kensington SW7 5BD",lat:51.4966,lng:-0.1764,
   note:"The Natural History Museum is one of London's absolute greatest free attractions and one we return to again and again. The blue whale skeleton in Hintze Hall is genuinely awe-inspiring, the dinosaur section is brilliant for all ages, and the Geology section has some of the most beautiful minerals you'll ever see. It's so good. Free entry means there's absolutely no excuse not to visit.",
   hours:"Daily 10:00–17:50",tip:"Book a free timed entry ticket online in advance — it gets very busy especially at weekends.",type:"Natural history museum",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.nhm.ac.uk"},

  {id:3,nbhd:"city",name:"Tower of London",cat:"landmark",emoji:"🏰",
   address:"Tower Hill, EC3N 4AB",lat:51.5081,lng:-0.0759,
   note:"A thousand years of history, drama and dark secrets in one fortress. The Crown Jewels alone justify the visit — the Imperial State Crown and its 2,868 diamonds are quite the sight. The Yeoman Warder tours are brilliant and included with entry. We especially love exploring the medieval walls at sunset when most day-trippers have gone.",
   hours:"Tue–Sat 09:00–17:30, Sun–Mon 10:00–17:30",tip:"Book tickets online in advance to skip the queues. The Yeoman Warder tours leave every 30 min — join one.",type:"Historic fortress",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.hrp.org.uk/tower-of-london"},

  {id:4,nbhd:"city",name:"St Paul's Cathedral",cat:"landmark",emoji:"⛪",
   address:"St Paul's Churchyard, EC4M 8AD",lat:51.5138,lng:-0.0984,
   note:"Sir Christopher Wren's masterpiece and one of London's most iconic skyline sights. Climb to the Whispering Gallery inside the dome (if you're fit enough for the 257 steps!) to hear the acoustic wonder, then climb higher still for Golden Gallery views across the city. The interior is breathtaking. We never tire of seeing it lit up at night.",
   hours:"Mon–Sat 08:30–16:30",tip:"The Whispering Gallery fills up — go up to the Stone Gallery and Golden Gallery too for the real views.",type:"Historic cathedral",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.stpauls.co.uk"},

  {id:5,nbhd:"west-end",name:"Buckingham Palace & The Mall",cat:"landmark",emoji:"👑",
   address:"Buckingham Palace, Westminster SW1A 1AA",lat:51.5014,lng:-0.1419,
   note:"Even as Londoners we still find ourselves walking down The Mall in awe. The Changing of the Guard is genuinely impressive — colourful, musical and a real piece of living tradition. We'd recommend booking a palace tour in summer to get inside the State Rooms. The walk through St James's Park to get here is one of London's most beautiful.",
   hours:"Changing of the Guard: 11:15 daily (check calendar for schedule)",tip:"Walk from Westminster along Birdcage Walk through St James's Park for the most scenic approach.",type:"Royal palace",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.rct.uk"},

  {id:6,nbhd:"west-end",name:"Houses of Parliament & Big Ben",cat:"landmark",emoji:"🏛️",
   address:"Westminster Bridge Rd, Westminster SW1A 0AA",lat:51.4995,lng:-0.1248,
   note:"One of the most recognisable buildings on earth and still as impressive up close as in photographs. You can wander around Parliament Square and Westminster Bridge for free and the view is brilliant. If you want to go inside for a free tour, UK residents can arrange entry through their MP — we've watched Prime Minister's Questions and it's a surreal, unmissable experience.",
   hours:"Exterior always accessible; tours vary",tip:"Cross Westminster Bridge for the best photographic angle of the clock tower and palace.",type:"Parliament & landmark",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.parliament.uk"},

  {id:7,nbhd:"city",name:"Sky Garden — free city views",cat:"landmark",emoji:"🌿",
   address:"20 Fenchurch St, EC3M 3BY (Walkie Talkie building)",lat:51.5113,lng:-0.0835,
   note:"One of London's best-kept secrets — a totally free sky garden at the top of the Walkie Talkie building with jaw-dropping 360° views across the city. There's also a restaurant and bar up there if you want to make it an event. The gardens themselves are lush and tropical, which feels wonderfully surreal when you're looking down at the City below.",
   hours:"Mon–Fri 10:00–18:00, Sat–Sun 11:00–21:00",tip:"Book your free ticket in advance online — they go quickly! Come at sunset for the golden hour views.",type:"Free rooftop garden",blog:"https://handluggageonly.co.uk/12-iconic-london-bars-with-breathtaking-views-across-the-city/",website:"https://skygarden.london"},

  {id:8,nbhd:"west-end",name:"National Gallery, Trafalgar Square",cat:"art",emoji:"🎨",
   address:"Trafalgar Square, WC2N 5DN",lat:51.5089,lng:-0.1283,
   note:"Free entry to one of the world's greatest art collections — Van Gogh, Caravaggio, Turner, Rembrandt, Monet. All here, all free. We love an impromptu hour at the National Gallery on a rainy London afternoon when you can really take your time. The new Sainsbury Wing has some of the most beautiful early Renaissance paintings you'll ever see.",
   hours:"Daily 10:00–18:00 (Fri until 21:00)",tip:"Grab a floor plan at the entrance and make a shortlist — it's vast and easy to miss the pieces you love most.",type:"Free world-class art gallery",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.nationalgallery.org.uk"},

  // ── ART & CULTURE ─────────────────────────────────────────
  {id:9,nbhd:"south-bank",name:"Tate Modern",cat:"art",emoji:"🖼️",
   address:"Bankside, SE1 9TG",lat:51.5076,lng:-0.0994,
   note:"The world's most visited modern art gallery and one of our all-time favourite spots in London. The building — a converted power station — is spectacular, and the art inside is consistently challenging and brilliant. The Turbine Hall installations are always unmissable. Best of all, the permanent collection is completely free.",
   hours:"Daily 10:00–18:00 (Fri–Sat until 22:00)",tip:"Walk across the Millennium Bridge from St Paul's for the most dramatic approach. The view back from the riverfront is stunning.",type:"Modern art gallery — free",blog:"https://handluggageonly.co.uk/13-best-things-to-do-in-south-london/",website:"https://www.tate.org.uk/visit/tate-modern"},

  {id:10,nbhd:"south-bank",name:"Shakespeare's Globe Theatre",cat:"landmark",emoji:"🎭",
   address:"21 New Globe Walk, Bankside SE1 9DT",lat:51.5081,lng:-0.0972,
   note:"Standing in the reconstructed Globe Theatre is one of London's most atmospheric experiences. Take the excellent guided tour to understand how Shakespeare's original audience experienced his plays. Better still, book a performance and stand in the yard as a groundling — the most authentic way to experience it, and the cheapest tickets on offer.",
   hours:"Tours run daily; performance schedule varies",tip:"Book 'groundling' yard tickets for performances — standing is the cheapest option and the most authentic Elizabethan experience.",type:"Historic theatre",blog:"https://handluggageonly.co.uk/13-best-things-to-do-in-south-london/",website:"https://www.shakespearesglobe.com"},

  {id:11,nbhd:"south-bank",name:"White Cube Gallery, Bermondsey",cat:"art",emoji:"⬜",
   address:"144-152 Bermondsey St, SE1 3TQ",lat:51.5000,lng:-0.0803,
   note:"One of the most important contemporary art galleries in the world — and completely free. The Bermondsey space is enormous and always houses something extraordinary and thought-provoking. We love that the exhibitions change so frequently. It's on Bermondsey Street which is one of our favourite parts of London, so combine it with a coffee at WatchHouse and lunch at José.",
   hours:"Tue–Sat 10:00–18:00, Sun 12:00–18:00",tip:"Check what's currently showing on their website before visiting — exhibitions change every few months.",type:"Contemporary art gallery — free",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://whitecube.com"},

  // ── PARKS & NATURE ────────────────────────────────────────
  {id:12,nbhd:"west-london",name:"Hyde Park & The Serpentine",cat:"park",emoji:"🌳",
   address:"Hyde Park, W2 2UH",lat:51.5073,lng:-0.1657,
   note:"London's great green lung — 350 acres of parkland right in the heart of the city. We love the Serpentine for a morning swim in summer, a lazy row on the water, and the beautiful Serpentine Gallery pavilion. In winter, the Winter Wonderland fills the park with fairy lights and festive chaos. A Sunday morning stroll through Hyde Park followed by brunch in Notting Hill is a near-perfect London day.",
   hours:"Daily 05:00–midnight",tip:"The Serpentine Lido (outdoor swimming) is open June–September. Early morning swims are magical.",type:"Royal park & lido",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.royalparks.org.uk/parks/hyde-park"},

  {id:13,nbhd:"greenwich",name:"Richmond Park — the deer!",cat:"park",emoji:"🦌",
   address:"Richmond Park, Richmond TW10 5HS",lat:51.4408,lng:-0.2756,
   note:"One of London's absolute greatest free experiences — a vast ancient royal deer park where 630 red and fallow deer roam completely freely. You can walk within metres of them. The park is also stunningly beautiful, with ancient oaks, meadows and incredible views back towards London from the ridge. It's a bit of a journey from Central London but completely worth it.",
   hours:"Daily — gates open early morning, close at dusk",tip:"Take the 371 or 65 bus from Richmond station. The Isabella Plantation rhododendron garden is stunning in April/May.",type:"Royal deer park — free",blog:"https://handluggageonly.co.uk/13-best-things-to-do-in-south-london/",website:"https://www.royalparks.org.uk/parks/richmond-park"},

  {id:14,nbhd:"greenwich",name:"Kew Gardens",cat:"park",emoji:"🌺",
   address:"Royal Botanic Gardens, Richmond TW9 3AE",lat:51.4787,lng:-0.2956,
   note:"The Royal Botanic Gardens at Kew are simply spectacular — one of the world's most important botanical collections spread across 326 beautiful acres. The Victorian Palm House is jaw-dropping, the Japanese pagoda is a delight, and the treetop walkway gives a completely different perspective on the park. Go in spring for the cherry blossoms.",
   hours:"Daily from 10:00 (closing times vary seasonally)",tip:"Spring is magical here — cherry blossom season is typically late March to April. Book ahead for peak season.",type:"Royal botanic gardens",blog:"https://handluggageonly.co.uk/13-best-things-to-do-in-south-london/",website:"https://www.kew.org"},

  {id:15,nbhd:"north-london",name:"Hampstead Heath & Parliament Hill",cat:"park",emoji:"🌄",
   address:"Hampstead Heath NW3",lat:51.5650,lng:-0.1658,
   note:"Escape the city on Hampstead Heath — 790 acres of ancient woodland and rolling hills north of London. Parliament Hill gives the best panoramic view over the entire city, absolutely stunning at sunset. The three open-air swimming ponds are iconic London summer experiences. Come on an autumn morning when mist rolls through the Heath and you'll understand why Londoners love it so fiercely.",
   hours:"Always open",tip:"Parliament Hill viewpoint is best at golden hour. The mixed pond is open year-round for the brave.",type:"Ancient heathland — free",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.cityoflondon.gov.uk/things-to-do/green-spaces/hampstead-heath"},

  // ── MARKETS ───────────────────────────────────────────────
  {id:16,nbhd:"south-bank",name:"Borough Market",cat:"market",emoji:"🧀",
   address:"8 Southwark St, SE1 1TL",lat:51.5055,lng:-0.0910,
   note:"London's most famous food market and, yes, it absolutely deserves that reputation. The quality is staggering — rare cheeses, artisan bread, incredible street food, charcuterie, spices. We love it most on a Thursday when it's busy but not overwhelmed. Get there with an empty stomach and just graze. The Raclette stall, the Scotch Eggs, and the truffle pasta are mandatory.",
   hours:"Mon–Thu 10:00–17:00, Fri 10:00–18:00, Sat 08:00–17:00",tip:"Go Thursday or Friday morning for a more relaxed experience. Saturday is spectacular but very busy.",type:"Artisan food market",blog:"https://handluggageonly.co.uk/12-best-markets-london-visit/",website:"https://boroughmarket.org.uk"},

  {id:17,nbhd:"north-london",name:"Camden Market",cat:"market",emoji:"🎸",
   address:"Camden Lock Place, Camden NW1 8AF",lat:51.5414,lng:-0.1483,
   note:"Camden Market is a world unto itself — a sprawling collection of markets, vintage shops, street food vendors, live music venues and canal-side bars all tumbled together in one glorious, chaotic neighbourhood. The street food variety here is extraordinary. Come for the energy, the people-watching and the canal atmosphere as much as the shopping.",
   hours:"Daily 10:00–18:00 (later on weekends)",tip:"Don't just do the main market — explore the Stables and Electric Ballroom areas for the best vintage finds.",type:"Iconic market complex",blog:"https://handluggageonly.co.uk/12-best-markets-london-visit/",website:"https://www.camden.market"},

  {id:18,nbhd:"west-london",name:"Portobello Road Market",cat:"market",emoji:"🏺",
   address:"Portobello Road, Notting Hill W11",lat:51.5152,lng:-0.2011,
   note:"The largest antique market in the world, right in the heart of gorgeous Notting Hill. On a Saturday, the whole street fills with antique dealers, vintage clothing, bric-a-brac, colourful produce stalls and street food. It's a perfect London morning — stroll Portobello Road, duck into the pastel-painted mews, get a coffee, haggle over something beautiful.",
   hours:"General stalls Mon–Sat; antiques on Saturdays from 08:00",tip:"The north end of Portobello has the best antiques on Saturday mornings. Arrive early for the best picks.",type:"Antique & street market",blog:"https://handluggageonly.co.uk/12-best-markets-london-visit/"},

  {id:19,nbhd:"east-london",name:"Columbia Road Flower Market",cat:"market",emoji:"🌸",
   address:"Columbia Road, Bethnal Green E2 7RG",lat:51.5290,lng:-0.0728,
   note:"Every Sunday morning, Columbia Road transforms into the most magical, fragrant flower market you can imagine. Mountains of blooms fill the air with colour and scent, the traders shout their prices, and the whole neighbourhood comes alive. The surrounding streets are full of brilliant independent shops. It's one of our absolute favourite London Sunday rituals.",
   hours:"Sundays only 08:00–15:00",tip:"Go at 13:00 onwards for the best deals as traders reduce prices before packing up.",type:"Sunday flower market",blog:"https://handluggageonly.co.uk/12-best-markets-london-visit/"},

  {id:20,nbhd:"east-london",name:"Brick Lane Market",cat:"market",emoji:"🧵",
   address:"Brick Lane, Tower Hamlets E1",lat:51.5226,lng:-0.0715,
   note:"Brick Lane on a Sunday morning is one of London's most vibrant and eclectic experiences. The market stretches across multiple sites and is brilliant for vintage finds, bric-a-brac, and the most diverse street food in London. The Bangladeshi restaurants on Brick Lane itself are some of the best value curry in the city. A wonderfully messy, brilliant morning out.",
   hours:"Sundays 10:00–17:00 (best days)",tip:"Combine with a bagel from Beigel Bake at the top of Brick Lane — open 24 hours, famous for decades.",type:"Sunday vintage market",blog:"https://handluggageonly.co.uk/12-best-markets-london-visit/"},

  {id:21,nbhd:"south-bank",name:"Maltby Street Market",cat:"market",emoji:"🥐",
   address:"Ropewalk, Bermondsey SE1 3PA",lat:51.5013,lng:-0.0803,
   note:"Maltby Street Market is like Borough Market's cooler, quieter little sibling. Set under the railway arches of Ropewalk in Bermondsey, it's a brilliant weekend foodie destination. Everything is artisan, quality is high, and you can actually move around without being elbowed. The producers are passionate and friendly and always happy to chat about what they make.",
   hours:"Sat 09:00–17:00, Sun 11:00–16:00",tip:"Pair it with Bermondsey Street for a perfect half-day in South London — market, coffee at WatchHouse, lunch at José.",type:"Artisan market",blog:"https://handluggageonly.co.uk/12-best-markets-london-visit/"},

  {id:22,nbhd:"greenwich",name:"Greenwich Market",cat:"market",emoji:"🎨",
   address:"College Approach, Greenwich SE10 9HY",lat:51.4824,lng:-0.0091,
   note:"Greenwich Market is brilliant — a covered historic market with a brilliant mix of food, arts and crafts, vintage finds and antiques. Being mostly covered, it's one of the few London markets where you won't get rained on! Make sure to visit the Teabird stalls for vintage crockery. The whole Greenwich area is gorgeous — combine with the Royal Naval College and Observatory.",
   hours:"Wed–Sun 10:00–17:30",tip:"Best visited on a Sunday when the full range of artisan and antique traders are present.",type:"Covered historic market",blog:"https://handluggageonly.co.uk/12-best-markets-london-visit/",website:"https://greenwichmarket.london"},

  // ── RESTAURANTS & FOOD ────────────────────────────────────
  {id:23,nbhd:"west-end",name:"Saison at Raffles OWO, Whitehall",cat:"food",emoji:"⭐",
   address:"57 Whitehall, Westminster SW1A 2BX",lat:51.5027,lng:-0.1282,
   note:"Nestled within the iconic Raffles Hotel in the former Old War Office building, Saison by Mauro Colagreco is Mediterranean-influenced fine dining in the most spectacular room. We love that it manages to be relatively informal for a high-end London restaurant. The Scallop Crudo is phenomenal. The Lake District Lamb with mint is simply outstanding. Book in advance — always.",
   hours:"Daily for breakfast and lunch; dinner Thu–Sat",tip:"Book at least two weeks in advance. Go for lunch rather than dinner for better value.",type:"Fine dining — Michelin",blog:"https://handluggageonly.co.uk/11-amazing-restaurants-to-eat-at-in-london/",website:"https://www.theowolondon.com/restaurants/saison"},

  {id:24,nbhd:"east-london",name:"The Culpeper, Spitalfields",cat:"food",emoji:"🍺",
   address:"40 Commercial St, Spitalfields E1 6LP",lat:51.5195,lng:-0.0728,
   note:"The Culpeper is something of an institution in East London and one of our absolute favourite spots for dinner. Beyond the beautiful pub interior and great beer, the seasonal food menu is genuinely brilliant — this is absolutely not your typical pub grub. Sourced from local suppliers, the seafood is always outstanding. Best on the rooftop terrace on a warm summer evening.",
   hours:"Mon–Sat 12:00–23:00, Sun 12:00–22:30",tip:"The rooftop is the prize — arrive early on summer evenings to bag a table. Also has hotel rooms upstairs!",type:"East London pub & restaurant",blog:"https://handluggageonly.co.uk/11-amazing-restaurants-to-eat-at-in-london/",website:"https://theculpeper.com"},

  {id:25,nbhd:"west-end",name:"Gordon's Wine Bar, Embankment",cat:"food",emoji:"🍷",
   address:"47 Villiers St, Embankment WC2N 6NE",lat:51.5087,lng:-0.1215,
   note:"Claiming to be London's oldest wine bar — established 1890 — Gordon's is an utterly atmospheric cave of candlelit barrels and good wine. Terrifyingly cramped, wonderfully romantic and genuinely timeless. We adore this place. The cheese and cold cuts are perfect accompaniments. Come in summer when the terrace spills out onto Embankment. One of London's great atmospheric pubs.",
   hours:"Mon–Sat 11:00–23:00, Sun 12:00–22:00",tip:"Arrive early (especially at weekends) — the indoor cave fills up incredibly fast. The outdoor terrace is equally wonderful in summer.",type:"Atmospheric wine bar",blog:"https://handluggageonly.co.uk/11-amazing-restaurants-to-eat-at-in-london/",website:"https://gordonswinebar.com"},

  {id:26,nbhd:"south-bank",name:"José tapas bar, Bermondsey",cat:"food",emoji:"🥘",
   address:"104 Bermondsey St, SE1 3UB",lat:51.5003,lng:-0.0823,
   note:"José is genuinely one of the best tapas bars in London — tiny, informal, buzzy and brilliant. Standing room only at the bar, traditional Spanish small plates done perfectly. The jamón, the padron peppers, the tortilla are all outstanding. It gets absolutely packed, so plan ahead. Part of the brilliant Bermondsey Street ecosystem — go here after White Cube or Watchhouse.",
   hours:"Mon–Sat 12:00–22:30, Sun 12:00–21:30",tip:"No reservations for the bar — arrive right when they open (noon) or expect to wait. Totally worth it.",type:"Spanish tapas bar",blog:"https://handluggageonly.co.uk/11-amazing-restaurants-to-eat-at-in-london/",website:"https://josebars.com"},

  {id:27,nbhd:"west-end",name:"Dishoom, Covent Garden",cat:"food",emoji:"🫚",
   address:"12 Upper St Martin's Lane, WC2H 9FB",lat:51.5124,lng:-0.1229,
   note:"Dishoom is the best Indian restaurant in London — bar none — and the Covent Garden branch is our favourite. Inspired by the old Irani cafés of Bombay, the décor is gorgeous and the food is extraordinary. The Black Dal is legendary (simmered for 24 hours), the breakfast bacon naan roll is one of London's best breakfasts, and the cocktails are brilliant.",
   hours:"Mon–Thu 08:00–23:00, Fri 08:00–00:00, Sat–Sun 09:00–00:00",tip:"Queues can be long — go at opening for breakfast (we love the bacon naan roll) or book dinner well in advance.",type:"Indian restaurant",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.dishoom.com"},

  {id:28,nbhd:"greenwich",name:"Royal Naval College — free to explore",cat:"landmark",emoji:"🏛️",
   address:"King William Walk, Greenwich SE10 9NN",lat:51.4827,lng:-0.0095,
   note:"The Old Royal Naval College at Greenwich is one of the most architecturally magnificent buildings in Britain — Wren's baroque masterpiece right on the Thames. The painted hall inside (think London's Sistine Chapel) is simply staggering and completely free to visit. Walking through the colonnaded courtyards with views to the Thames, it's impossible not to feel the history.",
   hours:"Daily 10:00–17:00; painted hall open same hours",tip:"The Painted Hall is unmissable — look up and take your time in there. The park walk up to the Observatory for city views is a perfect afternoon.",type:"Baroque architecture — free",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://ornc.org"},

  // ── BARS & DRINKS ─────────────────────────────────────────
  {id:29,nbhd:"east-london",name:"Happiness Forgets — speakeasy",cat:"bar",emoji:"🕵️",
   address:"8-9 Hoxton Square, N1 6NU",lat:51.5273,lng:-0.0800,
   note:"Easily the best cocktail bar in East London and possibly all of London. Happiness Forgets is tiny (seriously tiny — max 36 people), basement speakeasy energy, with the most precisely crafted cocktails you'll find anywhere. They keep half the tables unreserved each night so you can always try your luck. Open from 5pm. One of those places that makes you feel like you've found a secret.",
   hours:"Mon–Thu 17:00–23:00, Fri–Sat 17:00–00:00",tip:"Book a table — they do keep half unreserved but this place is special enough to warrant planning. The 'Happiness Forgets Sour' is outstanding.",type:"Speakeasy cocktail bar",blog:"https://handluggageonly.co.uk/9-best-bars-london/",website:"https://www.happinessforgetsbar.com"},

  {id:30,nbhd:"west-end",name:"Opium Cocktail & Dimsum Parlour",cat:"bar",emoji:"🏮",
   address:"15-16 Gerrard St, Chinatown W1D 6JE",lat:51.5115,lng:-0.1308,
   note:"Hidden behind an unmarked door in Chinatown, Opium is a gorgeous, moody three-floor cocktail bar inspired by Hong Kong opium dens of old. Incredible cocktails (the mezcal ones are spectacular), brilliant dim sum, and a beautifully designed space. We ended up stopping at each floor on our last visit and lost track of time entirely. One of London's best hidden venues.",
   hours:"Mon–Sat 17:00–00:00",tip:"Don't miss the mezcal cocktails — they're their speciality. The third floor bar has the best atmosphere.",type:"Hidden cocktail bar",blog:"https://handluggageonly.co.uk/9-best-bars-london/",website:"https://www.opiumchinatown.com"},

  {id:31,nbhd:"west-end",name:"Mr Fogg's Gin Parlour, Covent Garden",cat:"bar",emoji:"🍸",
   address:"1 New Row, Covent Garden WC2N 4EA",lat:51.5116,lng:-0.1244,
   note:"If you love gin — and who doesn't — Mr Fogg's is your London bucket list destination. They have an extraordinary gin list with hundreds of bottles, the staff are knowledgeable and enthusiastic, and the Phileas Fogg adventure theme gives the whole place a wonderfully eccentric atmosphere. Make a reservation — it gets busy.",
   hours:"Mon–Sat 12:00–23:00, Sun 12:00–22:30",tip:"Ask the bartender to recommend something unusual from their gin list — they love the challenge and always come up with something brilliant.",type:"Gin bar",blog:"https://handluggageonly.co.uk/9-best-bars-london/",website:"https://mr-foggs.com"},

  {id:32,nbhd:"city",name:"Sky Pod Bar at Sky Garden",cat:"bar",emoji:"🌆",
   address:"20 Fenchurch St, EC3M 3BY",lat:51.5113,lng:-0.0834,
   note:"The Sky Pod Bar inside Sky Garden is one of London's best for sunset cocktails — 360° floor-to-ceiling glass views across the entire city, from the Shard to St Paul's to the Thames. The cocktail menu is creative and the space is genuinely beautiful. Reserve a window table at sunset and you'll have one of London's most memorable evenings.",
   hours:"Mon–Fri from 10:00, Sat–Sun from 11:00",tip:"Reserve a table at the Sky Pod Bar for sunset — it's free entry to Sky Garden but the bar requires a reservation.",type:"Sky bar with views",blog:"https://handluggageonly.co.uk/12-iconic-london-bars-with-breathtaking-views-across-the-city/",website:"https://skygarden.london"},

  {id:33,nbhd:"south-bank",name:"GŎNG Bar at The Shard — level 52",cat:"bar",emoji:"✨",
   address:"31 St Thomas St, Southwark SE1 9RY",lat:51.5045,lng:-0.0865,
   note:"Perched on level 52 of The Shard, GŎNG has spectacular views and genuinely excellent cocktails. We reckon it's much better value than paying to go up the Shard as an attraction — you get equally incredible views plus brilliant drinks. They have the quirkiest and most creative cocktail menu around. Book the window and go at twilight.",
   hours:"Sun–Thu 12:00–00:00, Fri–Sat 12:00–01:00",tip:"Compare the price to just going up the Shard as a tourist — a cocktail here costs about the same and you get drinks with your views.",type:"Sky bar — The Shard",blog:"https://handluggageonly.co.uk/12-iconic-london-bars-with-breathtaking-views-across-the-city/",website:"https://www.aquashard.co.uk/gong"},

  {id:34,nbhd:"south-bank",name:"OXO Tower Bar & Brasserie",cat:"bar",emoji:"🌉",
   address:"Barge House St, South Bank SE1 9PH",lat:51.5072,lng:-0.1079,
   note:"The OXO Tower brasserie on the South Bank has brilliant views across the Thames to St Paul's and the City. It might not be the highest rooftop in London, but the view is genuinely one of the most beautiful — the Millennium Bridge and St Paul's combination is spectacular at sunset. The menu of modern British food is very good too.",
   hours:"Daily noon–22:30",tip:"Book a window table and go for sunset drinks rather than dinner — the views are the real attraction.",type:"Riverside bar with views",blog:"https://handluggageonly.co.uk/12-iconic-london-bars-with-breathtaking-views-across-the-city/",website:"https://www.harveynichols.com/restaurant/oxo-tower-london"},

  {id:35,nbhd:"greenwich",name:"Bussey Rooftop Bar, Peckham",cat:"bar",emoji:"🏙️",
   address:"133 Rye Lane, Peckham SE15 4ST",lat:51.4706,lng:-0.0648,
   note:"Frank's / Bussey Rooftop in Peckham is one of London's most beloved seasonal rooftop spots — open in the warmer months, with panoramic south London views, canned natural wines, jugs of Pimms and a wonderfully laid-back crowd. Very much a local favourite rather than a tourist spot, and all the better for it. Combine with Peckham Levels below.",
   hours:"Summer months (approx May–Sep), Thu–Sun from 17:00",tip:"Seasonal only — check their Instagram for opening dates and hours. Get there before 19:00 for a table.",type:"Seasonal rooftop bar",blog:"https://handluggageonly.co.uk/12-iconic-london-bars-with-breathtaking-views-across-the-city/"},

  // ── CAFES & COFFEE ────────────────────────────────────────
  {id:36,nbhd:"south-bank",name:"Monmouth Coffee, Borough",cat:"cafe",emoji:"☕",
   address:"2 Park St, Borough SE1 9AB",lat:51.5056,lng:-0.0909,
   note:"Monmouth is to London what Blue Bottle is to San Francisco — the coffee obsessive's pilgrimage point. Their Borough Market outpost is brilliant — tiny, warm, always smelling incredible. The coffee changes with the season as they source and roast their own beans obsessively. Pair it with the amazing Borough Market outside. A perfect London Saturday morning ritual.",
   hours:"Mon–Sat 07:30–18:00",tip:"Get there before 10am on a Saturday — it gets wonderfully busy but the queue inside moves fast.",type:"Specialty coffee",blog:"https://handluggageonly.co.uk/11-places-for-the-best-coffee-in-london/",website:"https://www.monmouthcoffee.co.uk"},

  {id:37,nbhd:"south-bank",name:"WatchHouse Bermondsey",cat:"cafe",emoji:"⌚",
   address:"198 Bermondsey St, SE1 3TQ",lat:51.5003,lng:-0.0817,
   note:"Our favourite coffee shop in South London — WatchHouse Bermondsey is built inside a genuine historic Victorian watch house used to guard the local cemetery from grave robbers. The coffee is outstanding and the space is gorgeous — exposed brick, high ceilings, beautiful original details. Perfect base for a Bermondsey morning. Pair with White Cube gallery and José tapas nearby.",
   hours:"Mon–Fri 07:30–17:00, Sat–Sun 08:00–17:00",tip:"Get there early — it fills up fast on weekends. The almond flat white is our usual order.",type:"Specialty coffee — Victorian building",blog:"https://handluggageonly.co.uk/11-places-for-the-best-coffee-in-london/",website:"https://watchhouse.com"},

  {id:38,nbhd:"west-end",name:"Attendant Coffee — Victorian lav!",cat:"cafe",emoji:"🚾",
   address:"27A Foley St, Fitzrovia W1W 6DY",lat:51.5209,lng:-0.1369,
   note:"One of London's most unique coffee experiences — Attendant is a specialty coffee shop built inside a perfectly preserved Victorian underground public toilet on Foley Street in Fitzrovia. The original porcelain urinals now serve as countertops. It's very small, very good, and genuinely one of a kind. A brilliant story to tell when you get home.",
   hours:"Mon–Fri 08:00–16:30, Sat–Sun 10:00–17:00",tip:"Go just for the experience if nothing else — a specialty flat white in a Victorian loo is a quintessential London moment.",type:"Specialty coffee — Victorian toilet",blog:"https://handluggageonly.co.uk/11-places-for-the-best-coffee-in-london/",website:"https://the-attendant.com"},

  {id:39,nbhd:"east-london",name:"Ozone Coffee Roasters, Shoreditch",cat:"cafe",emoji:"🌱",
   address:"11 Leonard St, Shoreditch EC2A 4AQ",lat:51.5249,lng:-0.0888,
   note:"One of Shoreditch's best and most characterful specialty coffee shops — Ozone roasts their own beans on-site, the staff are incredibly knowledgeable without being pretentious about it, and the food menu (particularly the brunch plates) is seriously good. The bakery section always has something brilliant. It has a great energy — feels like a proper neighbourhood place.",
   hours:"Mon–Fri 07:30–17:00, Sat–Sun 09:00–17:00",tip:"The poached eggs on sourdough here are some of the best in Shoreditch. Arrive before 10am on weekends for a table.",type:"Specialty coffee roaster",blog:"https://handluggageonly.co.uk/11-places-for-the-best-coffee-in-london/",website:"https://ozonecoffee.co.uk"},

  {id:40,nbhd:"east-london",name:"Shoreditch Grind, Old Street",cat:"cafe",emoji:"🎵",
   address:"213 Old St, Shoreditch EC1V 9NR",lat:51.5255,lng:-0.0888,
   note:"Shoreditch Grind is an institution — part coffee shop, part bar, part live music venue. During the day it's a brilliant coffee spot, at night it transforms into one of the most vibrant bars in East London. The cylinder-shaped corner building is iconic. Perfect for watching the world go by on Old Street roundabout over an excellent flat white.",
   hours:"Mon–Thu 07:00–00:00, Fri 07:00–01:00, Sat 08:30–01:00, Sun 09:30–22:30",tip:"Come back in the evening — it transitions brilliantly from coffee to cocktail bar as the night unfolds.",type:"Coffee by day, bar by night",blog:"https://handluggageonly.co.uk/unique-independent-coffee-shops-in-london/",website:"https://thegrind.co.uk/shoreditch-grind"},

  // ── NEIGHBOURHOODS & AREAS ────────────────────────────────
  {id:41,nbhd:"south-bank",name:"Bermondsey Street",cat:"landmark",emoji:"🧱",
   address:"Bermondsey Street, London SE1",lat:51.5003,lng:-0.0830,
   note:"Bermondsey Street is one of our all-time favourite pockets of London — a gorgeous village-like street just minutes from London Bridge that somehow manages to feel like a neighbourhood. Independent shops, brilliant restaurants, the excellent White Cube gallery, WatchHouse coffee and José tapas all within a few hundred metres. Perfect for a laid-back Saturday afternoon.",
   hours:"Shops and cafes open from morning; evening dining",tip:"Start with coffee at WatchHouse, browse White Cube gallery, then settle in at José for lunch. A perfect South London half-day.",type:"Neighbourhood street",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/"},

  {id:42,nbhd:"east-london",name:"Shoreditch & Brick Lane area",cat:"landmark",emoji:"🎨",
   address:"Shoreditch High St, E1",lat:51.5229,lng:-0.0749,
   note:"Shoreditch is London's creative heartland — street art around every corner, incredible independent restaurants and bars, vintage shops, the best coffee in East London and a brilliantly buzzy energy especially on weekends. Start at Brick Lane for markets and bagels, walk down to Shoreditch High Street for coffee and galleries, then follow the street art trail through Redchurch Street.",
   hours:"Best at weekends — most things open from mid-morning",tip:"Download a street art map before arriving — there are some world-class Banksy and Stik works hidden in alleyways if you know where to look.",type:"Creative neighbourhood",blog:"https://handluggageonly.co.uk/12-best-things-to-do-in-east-london/"},

  {id:43,nbhd:"west-london",name:"Notting Hill & Portobello Road",cat:"landmark",emoji:"🌈",
   address:"Portobello Road, Notting Hill W11",lat:51.5152,lng:-0.2046,
   note:"Notting Hill is one of London's most beautiful and photogenic neighbourhoods — the pastel-coloured houses, independent boutiques and brilliant cafes make it somewhere we return to constantly. Portobello Road on a Saturday is magical. The area around Blenheim Crescent has some of London's best food shops. In August, the Notting Hill Carnival transforms the whole neighbourhood.",
   hours:"Shops open daily; Portobello Market best on Saturdays",tip:"Blenheim Crescent on a Saturday morning: Books For Cooks, The Spice Shop and a great coffee — perfect.",type:"London neighbourhood",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/"},

  {id:44,nbhd:"west-end",name:"Covent Garden & Seven Dials",cat:"landmark",emoji:"🎪",
   address:"Covent Garden Piazza, WC2E 8RF",lat:51.5117,lng:-0.1228,
   note:"Covent Garden is one of those parts of London that never gets old. The piazza has great street performers, the covered market is gorgeous for browsing and shopping, and the surrounding streets are full of brilliant restaurants and shops. Seven Dials just north is brilliant — seven streets radiating from a sundial, packed with independent shops and great places to eat.",
   hours:"Market daily 10:00–20:00",tip:"The free street performances in the piazza are brilliant — the 'pitch' system means performers work hard for your appreciation.",type:"Historic market district",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.coventgarden.london"},

  {id:45,nbhd:"greenwich",name:"Peckham Levels & Rye Lane",cat:"landmark",emoji:"🏗️",
   address:"95A Rye Lane, Peckham SE15 4TT",lat:51.4706,lng:-0.0614,
   note:"Peckham has transformed into one of South London's most exciting neighbourhoods, and Peckham Levels is at the heart of it — a car park conversion housing art studios, independent food vendors, bars and creative spaces on multiple floors. It encapsulates the raw, creative energy that makes Peckham so exciting right now. The rooftop bar above is brilliant in summer.",
   hours:"Daily from afternoon; eve events Thu–Sun",tip:"Come on a Thursday or Friday evening when the food vendors and bars are all open and the energy is brilliant.",type:"Creative arts & food space",blog:"https://handluggageonly.co.uk/13-best-things-to-do-in-south-london/",website:"https://peckhamlevels.org"},

  {id:46,nbhd:"north-london",name:"Camden Lock & the canals",cat:"landmark",emoji:"🛶",
   address:"Camden Lock Place, Camden NW1 8AF",lat:51.5412,lng:-0.1467,
   note:"Camden Lock on the Regent's Canal is one of London's most atmospheric spots — especially if you take a canal boat from here east towards Islington or west towards Little Venice. The canal-side is dotted with barges, locks and brilliant pubs. Combine the Lock with the markets just above and it's a perfect Camden half-day. Book a canal boat for a completely different perspective on London.",
   hours:"Lock always accessible; boats bookable seasonally",tip:"Book a Regent's Canal boat trip from Camden Lock to Little Venice — about 90 minutes of completely beautiful, peaceful London.",type:"Canal & market",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/"},

  // ── MORE FOOD & DRINK GEMS ─────────────────────────────────
  {id:47,nbhd:"south-bank",name:"London Bridge & Southwark Cathedral",cat:"landmark",emoji:"🌉",
   address:"Southwark Cathedral, London Bridge SE1 9DA",lat:51.5060,lng:-0.0902,
   note:"The oldest Gothic church in London and one of its most underrated. Southwark Cathedral sits right next to Borough Market and is free to visit — the interior is genuinely beautiful, much less visited than St Paul's or Westminster Abbey. The churchyard outside has a brilliant atmosphere. Combine with Borough Market and a riverside walk along the South Bank.",
   hours:"Daily 08:00–18:00",tip:"Attend evensong (most weekdays at 17:30) for one of London's most atmospheric free experiences.",type:"Gothic cathedral — free",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://cathedral.southwark.anglican.org"},

  {id:48,nbhd:"city",name:"The Gherkin (30 St Mary Axe)",cat:"landmark",emoji:"🥒",
   address:"30 St Mary Axe, EC3A 8BF",lat:51.5145,lng:-0.0803,
   note:"Norman Foster's iconic glass bullet is one of London's most recognisable and beloved buildings — and the view from the top floor Iris Bar is extraordinary. Floor-to-ceiling glass at the tip of the Gherkin, 360° views across the city. Make a reservation for the bar and arrive at sunset. It's one of our top recommendations for a special London evening.",
   hours:"Iris Bar: Mon–Fri 11:00–23:00, Sat 12:00–23:00",tip:"Book a table at Iris bar at the top — reserve specifically requesting a window spot and go at golden hour.",type:"Iconic architecture & sky bar",blog:"https://handluggageonly.co.uk/12-iconic-london-bars-with-breathtaking-views-across-the-city/",website:"https://www.searcys.co.uk/venues/the-gherkin"},

  {id:49,nbhd:"west-end",name:"The London Eye, South Bank",cat:"landmark",emoji:"🎡",
   address:"Riverside Building, Westminster Bridge Rd SE1 7PB",lat:51.5033,lng:-0.1196,
   note:"London's famous observation wheel is a genuinely brilliant experience, especially at sunset or twilight. The 30-minute rotation gives you spectacular views across the whole city — the Thames, Big Ben, St Paul's, Canary Wharf, all laid out below you. We love it most in the evening when the city lights come on. Book tickets online in advance to skip the queues.",
   hours:"Daily from 11:00; extended hours in summer",tip:"Book for the last ride of the evening at dusk — the golden and blue hour views are spectacular. Far less crowded than peak daytime.",type:"Observation wheel",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.londoneye.com"},

  {id:50,nbhd:"west-london",name:"Victoria & Albert Museum — V&A",cat:"art",emoji:"🏺",
   address:"Cromwell Rd, South Kensington SW7 2RL",lat:51.4966,lng:-0.1727,
   note:"The V&A is our absolute favourite museum in London — the world's greatest museum of art, design and performance, and completely free. The fashion, jewellery and textile collections are extraordinary. The café (in the original ornate Victorian dining rooms — the world's first museum café) is absolutely worth a visit in itself. We could lose entire days here happily.",
   hours:"Daily 10:00–17:45 (Fri until 22:00 for 'Friday Late')",tip:"Visit on a Friday evening for Friday Lates — a programme of events, music and the museum at its most atmospheric. Still free.",type:"Design & art museum — free",blog:"https://handluggageonly.co.uk/28-very-best-things-to-do-in-london/",website:"https://www.vam.ac.uk"},

];

// ── CATEGORY COLOURS & LABELS ─────────────────────────────────
const CC = {
  landmark: "#c8623a",
  food:     "#e8a030",
  cafe:     "#5a8f68",
  bar:      "#7065a8",
  market:   "#b8704a",
  park:     "#4a8a58",
  art:      "#4878a8",
};

const CL = {
  landmark: "Landmark",
  food:     "Restaurant",
  cafe:     "Café & Coffee",
  bar:      "Bar & Views",
  market:   "Market",
  park:     "Park & Nature",
  art:      "Art & Culture",
};

// ── Google Maps API key (same across all guides) ──────────────
const API_KEY = 'AIzaSyAFnO6GpVK_EBLTOMa15zYe9eNWuDJEBEU';

let map, markers = {}, placesService, AID = null, AF = 'all';
let photoCache = {};
