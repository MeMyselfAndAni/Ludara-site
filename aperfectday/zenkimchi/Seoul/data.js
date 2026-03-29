// A Perfect Day — ZenKimchi / Seoul
// data.js — curated places
//
// ══ CONTENT AUTHENTICITY RULES ══
//   note:  Joe McPherson's exact published words, verbatim from zenkimchi.com
//   tip:   Joe's exact words, or empty string. Never invented.
//   label: Always "Visitor Tip" in index.html — never blogger's name.
//
// SOURCE ARTICLES:
//   A = https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
//   B = https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/
//   C = https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/
//   D = https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/linus-bama-style-bbq/
//   E = https://zenkimchi.com/tour-tips/noryangjin-fish-market-new-guide/
//   F = https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/
//   G = https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
//   H = https://zenkimchi.com/tour-tips/majang-meat-market-seoul/
//   I = https://zenkimchi.com/zenkimchi-get-immersed-in-korea/the-authentic-korean-chicken-and-beer-experience/

const PLACES = [

  // ─── MAPO / GONGDEOK ─────────────────────────────────────────────────────

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 1,
    nbhd: 'nbhd-mapo',
    name: 'Jeong Daepo 마포정대포',
    cat: 'food',
    emoji: '🥩',
    address: 'Mapo-daero, Mapo-gu (near Gongdeok Station)',
    lat: 37.5465,
    lng: 126.9513,
    search: 'Jeong Daepo BBQ Seoul Gongdeok',
    note: "My go-to place is still Jeong Daepo in the Mapo neighborhood, near Gongdeok Station. The whole area is full of BBQ aromas. Most all the restaurants in that area are great. We made sure Anthony Bourdain went there the last time he was in Seoul. It's the main place we go to on The Ultimate Korean BBQ Night Out.",
    hours: 'Daily, lunch and dinner',
    tip: '',
    type: 'Korean BBQ',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 2,
    nbhd: 'nbhd-mapo',
    name: 'Hongik Sutbul Galbi 홍익숯불갈비소금구',
    cat: 'food',
    emoji: '🔥',
    address: 'Mapo-gu, Seoul (Gongdeok area)',
    lat: 37.5468,
    lng: 126.9521,
    search: 'Hongik Sutbul Galbi Sogeum Gwi Gongdeok Seoul',
    note: "I don't know how long this will hold out against the pressure of gentrification. It's a packed, packed, packed place. They give your meat a pre-cook over strong fire before finishing it at your table.",
    hours: 'Daily, dinner',
    tip: '',
    type: 'Korean BBQ',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 3,
    nbhd: 'nbhd-mapo',
    name: 'Two-Two Chicken 둘둘치킨',
    cat: 'pub',
    emoji: '🍗',
    address: 'Near Gongdeok Station, Mapo-gu (multiple locations across Seoul)',
    lat: 37.5474,
    lng: 126.9517,
    search: 'Two Two Chicken 둘둘치킨 Gongdeok Seoul',
    note: "You can't go wrong with Two-Two. You'll likely be the youngest person in any of its locations. It's a franchise, but each venue acts like a mom-and-pop shop. The basic recipe and yangnyeom (spicy sweet garlic sauce) are the same, but they put their own spins on the sauces. They're outside Gongdeok Station, and the couple who runs it is great and welcoming. I want them to get more love.",
    hours: 'Daily from 5pm',
    tip: '',
    type: 'Chicken Hof',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 4,
    nbhd: 'nbhd-mapo',
    name: 'Nureungji Tongdalk 누릉지통닭',
    cat: 'pub',
    emoji: '🐓',
    address: 'Near Gongdeok Station and Sookmyung Women\'s University, Seoul',
    lat: 37.5471,
    lng: 126.9510,
    search: 'Nureungji Tongdalk 누릉지통닭 Gongdeok Seoul',
    note: "A new brand, they don't do fried. Chicken is spit roasted over wood and served on sizzling platters of crispy rice. We also go to this on the new Authentic Korean Chicken & Beer Experience. The ones near Gongdeok and Sookmyung Women's University kill.",
    hours: 'Daily from 5pm',
    tip: '',
    type: 'Rotisserie Chicken',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE B: https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/
    // ✅ Verified exact words from source
    id: 5,
    nbhd: 'nbhd-mapo',
    name: 'Ddobagi Chicken 또바기치킨',
    cat: 'pub',
    emoji: '🌶️',
    address: 'Multiple locations across Seoul (search 또바기치킨 on Naver Map)',
    lat: 37.5469,
    lng: 126.9508,
    search: 'Ddobagi Chicken 또바기치킨 Seoul',
    note: "This classic style chicken has been around since 1986. They are brined for 24 hours before being coated in a spicy powder, breaded, and fried. You can get their mild version. You can also get their spicy version with spicy sauce. It's a good satisfying challenge.",
    hours: 'Daily from 5pm',
    tip: '',
    type: 'Fried Chicken',
    blog: 'https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/',
    website: 'http://ddobagi.kr/',
  },

  // ─── HONGDAE / MANGWON ───────────────────────────────────────────────────

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 6,
    nbhd: 'nbhd-hongdae',
    name: 'Chicken Baengi 치킨뱅이',
    cat: 'pub',
    emoji: '🍺',
    address: 'North of main Hongdae strip — exit 7 Hongik University Station, head south two blocks',
    lat: 37.5574,
    lng: 126.9268,
    search: 'Chicken Baengi 치킨뱅이 Hongdae Seoul',
    note: "They also do it classic style. Get their chicken 3-ways: fried, sauced, and garlic. Then go for the pa dalk, boneless chicken thighs on top of dressed ribbons of green onions. My favorite location is run by two ladies on the north of the main strip of Hongdae.",
    hours: 'Daily from 5pm',
    tip: '',
    type: 'Chicken Hof',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 7,
    nbhd: 'nbhd-hongdae',
    name: 'Hongdae Crazy Street Food Alley',
    cat: 'market',
    emoji: '🛒',
    address: 'Exit 9, Hongik University Station, head south past the buskers',
    lat: 37.5558,
    lng: 126.9244,
    search: 'Hongdae street food alley 홍대 Seoul',
    note: "Carts with the basics camp outside Hongik University Station, exit 9. Further down, past the buskers, you can find what I call Crazy Street Food Alley. It's a series of stalls that are always rotating with new street food ideas. It's like a market research lab throwing everything against the wall to see what sticks.",
    hours: 'Daily, afternoon into late night',
    tip: '',
    type: 'Street Food',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE G: https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
    // ✅ Verified exact words from source
    id: 8,
    nbhd: 'nbhd-hongdae',
    name: 'Mangwon Market 망원시장',
    cat: 'market',
    emoji: '🥟',
    address: 'Mangwon-dong, Mapo-gu (Mangwon Station, Line 6)',
    lat: 37.5559,
    lng: 126.9061,
    search: 'Mangwon Market 망원시장 Seoul',
    note: "This is where real Koreans actually shop, and where young vendors are reinventing street food. We're talking deep-fried bulgogi dumplings, crème brûlée hotteok, and next-gen bungeoppang.",
    hours: 'Daily, most stalls from 10am',
    tip: '',
    type: 'Traditional Market',
    blog: 'https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/',
    website: '',
  },

  {
    // SOURCE C: https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/
    // ✅ Verified exact words from source
    id: 9,
    nbhd: 'nbhd-hongdae',
    name: 'Won Halmoni Bossam 원할머니보쌈',
    cat: 'food',
    emoji: '🐷',
    address: 'Multiple locations across Seoul (search 원할머니보쌈 on Naver Map)',
    lat: 37.5572,
    lng: 126.9252,
    search: 'Won Halmoni Bossam 원할머니보쌈 Seoul',
    note: "Yeah, it's just bossam. But it is consistently good. We tend to get it delivered, but I think it's best in the restaurant itself. The banchan is always diverse and tasty, including that sweet, fruity fresh kimchi. They have lunch specials that will fill you up.",
    hours: 'Daily, lunch and dinner',
    tip: '',
    type: 'Bossam (Pork Wraps)',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/',
    website: 'http://www.bossam.co.kr/',
  },

  {
    // SOURCE C: https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/
    // ✅ Verified exact words from source
    id: 10,
    nbhd: 'nbhd-hongdae',
    name: 'Jaws Tteokbokki 죠스떡볶이',
    cat: 'food',
    emoji: '🌊',
    address: 'Multiple locations across Seoul (search 죠스떡볶이 on Naver Map)',
    lat: 37.5568,
    lng: 126.9258,
    search: 'Jaws Tteokbokki 죠스떡볶이 Seoul',
    note: "The legend of Jaws goes like this. A guy quit his job and wanted to start a tteokbokki hut. Yet he didn't know the first thing about making it. He spent months in the kitchen perfecting his recipe. The result is a spicy and addictive tteokbokki. But Jaws doesn't stop there. They also serve a meaty soondae sausage, hearty odeng fish cakes, and super light and crispy twigim (tempura). I like mixing it all together with the thick tteokbokki sauce.",
    hours: 'Daily 11am–10pm',
    tip: '',
    type: 'Tteokbokki',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/',
    website: 'http://www.jawsfood.co.kr/',
  },

  {
    // SOURCE B: https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/
    // ✅ Verified exact words from source
    id: 11,
    nbhd: 'nbhd-hongdae',
    name: 'BHC 비에이치씨',
    cat: 'pub',
    emoji: '🍗',
    address: 'Multiple locations across Seoul (search BHC치킨 on Naver Map)',
    lat: 37.5563,
    lng: 126.9260,
    search: 'BHC Chicken Seoul',
    note: "Big Hit Chicken. Actually, they keep changing what the acronym stands for. This is the old standby and the typical family-style chicken joint. It's reliable, predictable, but satisfying.",
    hours: 'Daily from 5pm',
    tip: '',
    type: 'Fried Chicken',
    blog: 'https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/',
    website: 'https://www.bhc.co.kr/',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 12,
    nbhd: 'nbhd-hongdae',
    name: 'Sulbing 설빙',
    cat: 'cafe',
    emoji: '🧊',
    address: 'Multiple locations across Seoul (search 설빙 on Naver Map)',
    lat: 37.5567,
    lng: 126.9252,
    search: 'Sulbing 설빙 Seoul bingsu',
    note: "Sulbing is a franchise that popped up a few years ago. I wondered how risky such a venture would be–as in, who would order bingsu in winter? But they've done well. They're crowded in the summer. Sulbing specializes in Instagrammy bingsu, and that's a good thing.",
    hours: 'Daily 11am–10pm',
    tip: '',
    type: 'Bingsu (Shaved Ice)',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  // ─── JONGNO / INSADONG / GYEONGBOKGUNG ───────────────────────────────────

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 13,
    nbhd: 'nbhd-jongno',
    name: 'Gwanghwamun Jip 광화문집',
    cat: 'food',
    emoji: '🍲',
    address: 'Near Gyeongbokgung Palace, Jongno-gu, Seoul',
    lat: 37.5771,
    lng: 126.9769,
    search: 'Gwanghwamun Jip 광화문집 Seoul kimchi jjigae',
    note: "Tiny, tiny, tiny place near Gyeongbokgung Palace. They have two items, kimchi jjigae and gyeran mari (rolled omelet). Get both.",
    hours: 'Lunch only, closed weekends',
    tip: '',
    type: 'Kimchi Jjigae',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 14,
    nbhd: 'nbhd-jongno',
    name: 'Jeonju Yuhalmeoni Bibimbap 전주유할머니비빔밥',
    cat: 'food',
    emoji: '🍚',
    address: 'Insadong area, Jongno-gu, Seoul',
    lat: 37.5726,
    lng: 126.9817,
    search: 'Jeonju Yuhalmeoni Bibimbap 전주유할머니비빔밥 Seoul',
    note: "Respect, respect, respect. Grandmother knows how to make good bibimbap. This place has been around for over 50 years. Simple menu. Get the bibimbap and the Kongnamul Gukbap (Bean Sprout Soup).",
    hours: 'Daily, lunch and dinner',
    tip: '',
    type: 'Bibimbap',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // ⚠️ Source: ZenKimchi RSS/itinerary — text confirmed Joe's voice but exact article unverified
    // Run QA agent to locate original article before outreach
    id: 15,
    nbhd: 'nbhd-jongno',
    name: 'Tosokchon 토속촌',
    cat: 'food',
    emoji: '🐓',
    address: '5 Jahamun-ro 5-gil, Jongno-gu, Seoul',
    lat: 37.5796,
    lng: 126.9718,
    search: 'Tosokchon samgyetang Seoul Gyeongbokgung',
    note: "A favorite of former president Roh Mu-hyun, Tosokchon is another place that specializes in only one thing. The best places do that. Enter this classic hanok style complex, sit down and just use your fingers to tell the server how many bowls you need. Gorgeous bubbling bowls with whole chickens bathing in them show up with a rich silky broth. I'm not a big fan of samgyetang, but I make an exception for this one.",
    hours: 'Daily 10am–10pm',
    tip: '',
    type: 'Samgyetang (Ginseng Chicken Soup)',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/',
    website: '',
  },

  {
    // SOURCE A + Eric Ripert article
    // ✅ Verified exact words from source
    id: 16,
    nbhd: 'nbhd-jongno',
    name: 'Gwangjang Market 광장시장',
    cat: 'market',
    emoji: '🥘',
    address: '88 Changgyeonggung-ro, Jongno-gu, Seoul',
    lat: 37.5704,
    lng: 126.9996,
    search: 'Gwangjang Market 광장시장 Seoul bindaeddeok',
    note: "Explore Gwangjang Market and try some bindaeddeok. That's always fun. We moved on to some bindaeddeok, one of my favorites. We downed that with some road beers.",
    hours: 'Daily 9am–11pm',
    tip: '',
    type: 'Traditional Market',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE G: https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
    // ✅ Verified exact words from source
    id: 17,
    nbhd: 'nbhd-jongno',
    name: 'Ikseon-dong Hanok Village 익선동',
    cat: 'pub',
    emoji: '🏮',
    address: 'Ikseon-dong, Jongno-gu, Seoul (near Jongno 3-ga Station)',
    lat: 37.5762,
    lng: 126.9939,
    search: 'Ikseon-dong 익선동 Seoul cocktail bar hanok',
    note: "Instead of being a soulless theme park, Ikseon is a tight-knit warren of century-old hanok buildings filled with cocktail dens, handmade crafts, and surprisingly good bistros.",
    hours: 'Restaurants and bars from noon, cocktail bars from 6pm',
    tip: 'Avoid midday weekends — it\'s a zoo. Go early evening instead.',
    type: 'Cocktail Bars & Bistros',
    blog: 'https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/',
    website: '',
  },

  {
    // SOURCE G: https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
    // ✅ Verified exact words from source
    id: 18,
    nbhd: 'nbhd-jongno',
    name: 'Balwoo Gongyang 발우공양',
    cat: 'food',
    emoji: '☸️',
    address: '71 Ujeongguk-ro, Jongno-gu, Seoul (near Jogyesa Temple)',
    lat: 37.5735,
    lng: 126.9809,
    search: 'Balwoo Gongyang temple food Seoul Jogyesa',
    note: "Book a temple food tasting (try Balwoo Gongyang near Jogyesa) or do a short temple stay with a meal. It's vegan, but don't panic—this is Korean Buddhist food: deep flavors, fermented everything, and zero fake meat nonsense.",
    hours: 'Lunch and dinner sittings, reservations essential',
    tip: '',
    type: 'Buddhist Temple Cuisine',
    blog: 'https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 19,
    nbhd: 'nbhd-jongno',
    name: 'Insa-dong Street Food 인사동',
    cat: 'market',
    emoji: '🥐',
    address: 'Insadong main street, Jongno-gu, Seoul (Anguk Station exit 6)',
    lat: 37.5749,
    lng: 126.9855,
    search: 'Insadong street food Seoul hotteok',
    note: "Here you'll find the famous Insa-dong Hotteok, which puts a bit of cornmeal in its dough, giving it a super crunchy texture. Other highlights are the fire-grilled chicken on a stick and my beloved egg breads. Insa-dong's street food scene took a bad hit from both COVID-19's tourism dearth and the relentless bulldozing to make way for bland shopping malls.",
    hours: 'Daily 10am–9pm',
    tip: '',
    type: 'Street Food',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE: RSS/search result from ZenKimchi itinerary content
    // ✅ Verified exact words from source
    id: 20,
    nbhd: 'nbhd-jongno',
    name: 'Samhaejip 삼해집',
    cat: 'food',
    emoji: '🦪',
    address: 'Alley south of Jongno 3-ga Station, Jongno-gu, Seoul',
    lat: 37.5699,
    lng: 126.9904,
    search: 'Samhaejip 삼해집 bossam Jongno Seoul',
    note: "I've been on the hunt for restaurants with some history. In the alley maze south of Jongno 3-ga Station is a joint that has been serving bossam (juicy pork wraps) with oysters for over 35 years. You also get a bowl of gamjatang (pork spine soup) with your order. On weekend evenings, there's a line out the door for this place. And it's good!",
    hours: 'Daily lunch and dinner, busiest weekends',
    tip: '',
    type: 'Bossam with Oysters',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/',
    website: '',
  },

  {
    // SOURCE C: https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/
    // ✅ Verified exact words from source
    id: 21,
    nbhd: 'nbhd-jongno',
    name: 'Maetdollo-man 맷돌로만',
    cat: 'food',
    emoji: '🥩',
    address: 'Multiple locations across Seoul (search 맷돌로만 on Naver Map)',
    lat: 37.5738,
    lng: 126.9855,
    search: 'Maetdollo-man 맷돌로만 tofu Seoul',
    note: "This is my new favorite franchise, and they're expanding rapidly. They specialize in tofu. Housemade tofu. They make it out front behind the window for everyone to see. Korean tofu converts people who hate tofu. It has a rough masculine quality. Get their Dubu Bossam set, which includes some tender pork belly with tofu and wraps. Also get their Dubu Jeon, which is a crunchy pancake made solely out of tofu. Pure protein.",
    hours: 'Daily, lunch and dinner',
    tip: '',
    type: 'Housemade Tofu',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/',
    website: '',
  },

  // ─── EULJIRO / JUNG-GU / MYEONGDONG ─────────────────────────────────────

  {
    // SOURCE G: https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
    // ✅ Verified exact words from source
    id: 22,
    nbhd: 'nbhd-euljiro',
    name: 'Euljiro After Dark 을지로',
    cat: 'pub',
    emoji: '🌃',
    address: 'Euljiro 3-ga area, Jung-gu, Seoul (Euljiro 3-ga Station)',
    lat: 37.5660,
    lng: 126.9966,
    search: 'Euljiro 을지로 bar Seoul neon dive bar',
    note: "Think industrial workshops bathed in green and pink neon. Tiny staircases lead to smoky hideouts where bartenders serve cocktails in teacups, and Korean uncles sing 1980s ballads in the alleyways.",
    hours: 'Bars open from 6pm into the small hours',
    tip: 'Best for: Night owls, creatives, anti-influencer types.',
    type: 'Bar District',
    blog: 'https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 23,
    nbhd: 'nbhd-euljiro',
    name: 'Woo Lae Oak 우래옥',
    cat: 'food',
    emoji: '🍜',
    address: '62-29 Changgyeonggung-ro, Jung-gu, Seoul',
    lat: 37.5656,
    lng: 126.9898,
    search: 'Woo Lae Oak 우래옥 naengmyeon Seoul',
    note: "Famous, famous place. Almost too famous for being too famous. I like it, but it feels a bit stodgy. It's where you take your grandma after church. The prices are premium, but it's worth it for the naengmyeon.",
    hours: 'Daily 11:30am–9:30pm (closed every 1st & 3rd Mon)',
    tip: '',
    type: 'Naengmyeon (Cold Buckwheat Noodles)',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 24,
    nbhd: 'nbhd-euljiro',
    name: 'Dongmu Bapsang 둥무밥상',
    cat: 'food',
    emoji: '🇰🇵',
    address: 'Jung-gu, Seoul (search 둥무밥상 on Naver Map)',
    lat: 37.5632,
    lng: 126.9750,
    search: 'Dongmu Bapsang 둥무밥상 naengmyeon North Korean Seoul',
    note: "He used to cook for officers in the North Korean army before defecting to the South. Now his cozy shop serves dishes that he misses from home. Yes, definitely eat the naengmyeon here. Also try the soondae sausages.",
    hours: 'Daily, lunch and dinner',
    tip: '',
    type: 'North Korean Cuisine',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE C: https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/
    // ✅ Verified exact words from source
    id: 25,
    nbhd: 'nbhd-euljiro',
    name: 'Sae Maul Sikdang 새마을식당',
    cat: 'food',
    emoji: '🏮',
    address: 'Multiple locations across Seoul (search 새마을식당 on Naver Map)',
    lat: 37.5648,
    lng: 126.9950,
    search: 'Sae Maul Sikdang 새마을식당 Seoul yeoltan bulgogi',
    note: "This Korean restaurant chain has been getting quite popular with Koreans and expats. They are part of this 1970s nostalgic trend. Look at the lattice-work on the doors and the general feel of the place. The thing to order is the Yeoltan Bulgogi 열탄불고기. It's shaved pork smothered in spicy sauce. Toss that on the grill and make sure you have your favorite bev handy. Look for the place with the yellow roof.",
    hours: 'Daily 11am–11pm',
    tip: '',
    type: 'Korean BBQ (Pork)',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/',
    website: 'http://www.newmaul.com/',
  },

  {
    // SOURCE B: https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/
    // ✅ Verified exact words from source
    id: 26,
    nbhd: 'nbhd-euljiro',
    name: 'Goobne Chicken 굽네치킨',
    cat: 'pub',
    emoji: '♨️',
    address: 'Multiple locations across Seoul (search 굽네치킨 on Naver Map)',
    lat: 37.5651,
    lng: 126.9955,
    search: 'Goobne Chicken 굽네치킨 Seoul oven roasted',
    note: "Going into oven chicken territory, Goobne (GOOB-nay) has been getting popular lately. And it's good. Goobne has promoted itself as a healthy alternative to fried. All I know lately is that when we order it, it's stripped to the bone like those Winged Devourers did on \"Beastmaster.\"",
    hours: 'Daily from 5pm',
    tip: '',
    type: 'Oven Roasted Chicken',
    blog: 'https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/',
    website: '',
  },

  {
    // SOURCE F: https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/
    // ✅ Verified exact words from source
    id: 27,
    nbhd: 'nbhd-euljiro',
    name: 'Myeongdong Street Food 명동',
    cat: 'market',
    emoji: '🌪️',
    address: 'Myeongdong main street, Jung-gu, Seoul (Myeongdong Station exit 6)',
    lat: 37.5610,
    lng: 126.9830,
    search: 'Myeongdong street food Seoul tornado potato',
    note: "Myeong-dong's street food caters to the tourism crowd. It's also a place where the weirder inventions debut. The Tornado Potato was born here, as well as many street food staples and flashes in the pans.",
    hours: 'Daily 11am–11pm',
    tip: '',
    type: 'Street Food',
    blog: 'https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/',
    website: '',
  },

  {
    // SOURCE F: https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/
    // ✅ Verified exact words from source
    id: 28,
    nbhd: 'nbhd-euljiro',
    name: 'Andong Jjimdalk 안동찜닭 (Myeongdong)',
    cat: 'food',
    emoji: '🍛',
    address: 'Myeongdong, Jung-gu, Seoul',
    lat: 37.5607,
    lng: 126.9843,
    search: 'Andong Jjimdalk 안동찜닭 Myeongdong Seoul',
    note: "This is a franchise, but this is one of the better iterations of it. Jjimdalk is braised garlicky sweet chicken. It's a rich hearty dish that is best eaten in cooler weather. It doesn't cater well to single diners. You need to come with company to gorge on these huge plates of sticky sauce laden poultry.",
    hours: 'Daily 11am–10pm',
    tip: '',
    type: 'Braised Chicken',
    blog: 'https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/',
    website: '',
  },

  {
    // SOURCE F: https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/
    // ✅ Verified exact words from source
    id: 29,
    nbhd: 'nbhd-euljiro',
    name: 'Myeongdong Pizza',
    cat: 'food',
    emoji: '🍕',
    address: 'Myeongdong, Jung-gu, Seoul',
    lat: 37.5621,
    lng: 126.9850,
    search: 'Myeongdong Pizza Seoul Italian',
    note: "Whenever I'm in Myeongdong, I go here for lunch. The original chef, and now consulting chef, Eddie Ahn, trained in Italy. There's no sugar-coated garlic bread here (a longstanding aberration in many Korean Italian places). It's by far the best Italian restaurant in Myeong-dong.",
    hours: 'Daily, lunch and dinner',
    tip: '',
    type: 'Italian Pizza',
    blog: 'https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/',
    website: '',
  },

  {
    // SOURCE F: https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/
    // ✅ Verified exact words from source
    id: 30,
    nbhd: 'nbhd-euljiro',
    name: 'Myeongdong Haidilao 하이디라오',
    cat: 'food',
    emoji: '🫕',
    address: 'Myeongdong, Jung-gu, Seoul',
    lat: 37.5619,
    lng: 126.9848,
    search: 'Haidilao Myeongdong Seoul hot pot Chinese',
    note: "The Chinese embassy is close by, so there is good Chinese food to be had, if you know where to go. Myeongdong Haidilao is a hot pot franchise from China. It's English friendly and has a sauce bar. Yes, a sauce bar. Go for the spicy Sichuan broth.",
    hours: 'Daily 11am–2am',
    tip: '',
    type: 'Chinese Hot Pot',
    blog: 'https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/',
    website: '',
  },

  // ─── ITAEWON / YONGSAN ───────────────────────────────────────────────────

  {
    // SOURCE D: https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/linus-bama-style-bbq/
    // ✅ Verified exact words from source
    id: 31,
    nbhd: 'nbhd-itaewon',
    name: "Linus' Bama Style BBQ 라이너스바베큐",
    cat: 'food',
    emoji: '🤠',
    address: '56-20 Itaewon-dong, Yongsan-gu, Seoul',
    lat: 37.5348,
    lng: 126.9940,
    search: "Linus Bama Style BBQ Itaewon Seoul",
    note: "Birmingham, Alabama, native Linus Kim started making his mark in Seoul by holding BBQ pop-up restaurants for a few years. He then went to America to learn from the best. He returned and opened this permanent location. Linus cooks his meat slowly. The result is tender Q that is perfectly seasoned. It comes with a tangy spicy pork sauce and a sweeter brisket sauce, but the mark of a good BBQ is that it doesn't need the sauce.",
    hours: 'Lunch and dinner, closed Monday',
    tip: 'The Skinny Fries are best slathered in the pork sauce.',
    type: 'American BBQ',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/linus-bama-style-bbq/',
    phone: '02-790-2920',
    website: '',
  },

  {
    // SOURCE C: https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/
    // ✅ Verified exact words from source
    id: 32,
    nbhd: 'nbhd-itaewon',
    name: 'Orai Sutbul DalkGalbi 오라이숯불닭갈비',
    cat: 'food',
    emoji: '🍖',
    address: 'Multiple locations across Seoul (search 오라이숯불닭갈비 on Naver Map)',
    lat: 37.5343,
    lng: 126.9945,
    search: 'Orai Sutbul DalkGalbi 오라이숯불닭갈비 Seoul charcoal chicken',
    note: "This is great stuff! Dark meat chicken marinated in a sweet spicy sauce and thrown on the charcoal grill in front of you. Yes, you don't get the usual fried rice at the end, but by then you're on your third order. It's reasonably priced as well. One order will feed two people–or one Joe.",
    hours: 'Daily, lunch and dinner',
    tip: '',
    type: 'Charcoal Grilled DalkGalbi',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/',
    website: 'http://www.oraikorea.com/',
  },

  // ─── GANGNAM / JAMSIL / SEONGSU ──────────────────────────────────────────

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 33,
    nbhd: 'nbhd-gangnam',
    name: 'Gogung 고궁 (Starfield Gangnam)',
    cat: 'food',
    emoji: '👑',
    address: 'COEX Starfield Mall, 513 Yeongdong-daero, Gangnam-gu, Seoul',
    lat: 37.5115,
    lng: 127.0590,
    search: 'Gogung 고궁 bibimbap Gangnam Starfield Seoul',
    note: "I love Gogung. The original location is in Jeonju. It's a case of franchising out and collapsing. It's hard to find a Gogung in Seoul anymore. Thankfully, there is one in the Starfield Mall in Gangnam. This is classic refined royal Jeonju bibimbap served in brass bowls.",
    hours: 'Daily 11am–9pm (mall hours)',
    tip: '',
    type: 'Royal Jeonju Bibimbap',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 34,
    nbhd: 'nbhd-gangnam',
    name: 'Omori Jjigae 오모리찌개 (Jamsil)',
    cat: 'food',
    emoji: '🌶️',
    address: 'Jamsil, across the lake from Lotte World, Seoul (2nd floor)',
    lat: 37.5133,
    lng: 127.0829,
    search: 'Omori Jjigae 오모리찌개 Jamsil Seoul kimchi stew',
    note: "Go down to Jamsil, across the lake from Lotte World, and up to the second floor for this. It's a chain, but this is the flagship store. Go to the second floor. The first floor is for black bean noodles. Here, you can get 3-year-old Kimchi Jjigae. You'd be surprised at how subtle and smooth it tastes.",
    hours: 'Daily, lunch and dinner',
    tip: '',
    type: 'Kimchi Jjigae (3-Year-Old Kimchi)',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE B: https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/
    // ✅ Verified exact words from source
    id: 35,
    nbhd: 'nbhd-gangnam',
    name: 'Kyochon 교촌치킨',
    cat: 'pub',
    emoji: '🍗',
    address: 'Multiple locations across Seoul (search 교촌치킨 on Naver Map)',
    lat: 37.5100,
    lng: 127.0260,
    search: 'Kyochon 교촌치킨 Seoul battered fried chicken',
    note: "This is the one most Americans think of when talking about Korean fried chicken. Kyochon is the only franchise I know of that does it this way–batter dipped rather than rolled in flour or starch. The batter is garlicky with a slight sweetness. The crust shatters and stays crispy a long time. If you order it \"yangnyeom\" style, they meticulously paint the sauce on each piece individually. Caution–the breading really seals the contents inside. Expect a hot geyser of chicken juice to burst out in your first bite.",
    hours: 'Daily from 3pm',
    tip: '',
    type: 'Battered Fried Chicken',
    blog: 'https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/',
    website: 'http://www.kyochon.com/',
  },

  {
    // SOURCE B: https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/
    // ✅ Verified exact words from source
    id: 36,
    nbhd: 'nbhd-gangnam',
    name: 'Gyerimwon 계림원',
    cat: 'pub',
    emoji: '🪵',
    address: 'Gangnam-gu, Seoul (search 계림원 누릉지통닭 on Naver Map)',
    lat: 37.5058,
    lng: 127.0250,
    search: 'Gyerimwon 계림원 nureungji tongdalk Seoul Gangnam',
    note: "This style of chicken is called nureungji tongdalk 누릉지통닭, literally \"scorched rice fried chicken.\" It comes from Gangwon Province and has been growing in the Seoul Metro area. Gyerimwon is but one chain. Most all the places that serve this that I've been to have been outstanding. You'll know it by the rotisserie chickens in the window, the ream of oak logs out front, and this heavenly smoked chicken smell. Always start off with the original nureungji tongdalk. Then play with other variations, usually smothered in cheese, curry, or some other sauce. This will be your new favorite chicken and beer pairing.",
    hours: 'Daily from 5pm',
    tip: '',
    type: 'Scorched Rice Rotisserie Chicken',
    blog: 'https://zenkimchi.com/top-posts/best-korean-fried-chicken-joints/',
    website: '',
  },

  {
    // SOURCE C: https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/
    // ✅ Verified exact words from source
    id: 37,
    nbhd: 'nbhd-gangnam',
    name: 'Nolboo 놀부',
    cat: 'food',
    emoji: '🦆',
    address: 'Multiple locations across Seoul (search 놀부 on Naver Map)',
    lat: 37.5092,
    lng: 127.0280,
    search: 'Nolboo 놀부 Seoul clay pot duck budae jjigae',
    note: "Nolboo is hard to peg. They're a brand that has many different types of Korean restaurants. Some do Budae Jjigae, some do Clay Pot Duck, some do Galbi Jjim. In most cases, they serve high quality versions of whatever dish they specialize in. The Clay Pot Duck, Yuhwang Ori 유황오리, is the closest you get to Thanksgiving dinner in a Korean restaurant. The duck is stuffed with rice, various seeds, fruits, and Chinese medicinal ingredients. It's then baked in a clay pot for a few hours. The result is this steamy tender meat with this aromatic stuffing.",
    hours: 'Daily, lunch and dinner',
    tip: 'Bring a bottle of pinot noir for the Clay Pot Duck.',
    type: 'Clay Pot Duck / Budae Jjigae',
    blog: 'https://zenkimchi.com/zenkimchi-korean-food-journal/restaurants/great-korean-restaurant-franchises/',
    website: 'http://www.nolboo.co.kr/',
  },

  {
    // SOURCE H: https://zenkimchi.com/tour-tips/majang-meat-market-seoul/
    // ✅ Verified exact words from source (from G: what-to-do article)
    id: 38,
    nbhd: 'nbhd-gangnam',
    name: 'Majang Meat Market 마장축산물시장',
    cat: 'market',
    emoji: '🥩',
    address: 'Majang-dong, Seongdong-gu, Seoul (Majang Station, Line 5 Exit 2, 5 min walk)',
    lat: 37.5527,
    lng: 127.0563,
    search: 'Majang Meat Market 마장동 Seoul Hanwoo beef',
    note: "It's Seoul's largest meat market, but tourists rarely go. Why? Because it smells like beef and isn't sanitized. Pick your Hanwoo (Korean beef), then take it upstairs and grill it yourself with the same guys who butchered it. It's primal. It's glorious.",
    hours: 'Daily 6am–8pm (restaurants until later)',
    tip: 'Many butchers offer complimentary "service" cuts—often lean beef for eating raw with sesame oil and salt.',
    type: 'Hanwoo Beef Market & BBQ',
    blog: 'https://zenkimchi.com/tour-tips/majang-meat-market-seoul/',
    website: '',
  },

  {
    // SOURCE G: https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
    // ✅ Verified exact words from source
    id: 39,
    nbhd: 'nbhd-gangnam',
    name: 'Seongsu-dong 성수동',
    cat: 'cafe',
    emoji: '☕',
    address: 'Seongsu-dong, Seongdong-gu, Seoul (Seongsu Station, Line 2)',
    lat: 37.5443,
    lng: 127.0570,
    search: 'Seongsu-dong 성수동 Seoul cafes creative district',
    note: "Once a grimy shoe factory district, Seongsu is now where Seoul's creative class sips espresso in concrete bunkers and shops at indie pop-ups inside shipping containers.",
    hours: 'Cafes open from 10am, shops from noon',
    tip: 'Best for: Hipsters, brunchers, design geeks.',
    type: 'Café District',
    blog: 'https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/',
    website: '',
  },

  // ─── NORYANGJIN / YEOUIDO ────────────────────────────────────────────────

  {
    // SOURCE E: https://zenkimchi.com/tour-tips/noryangjin-fish-market-new-guide/
    // ✅ Verified exact words from source
    id: 40,
    nbhd: 'nbhd-noryangjin',
    name: 'Noryangjin Fish Market 노량진수산시장',
    cat: 'market',
    emoji: '🐙',
    address: '674 Nodeul-ro, Dongjak-gu, Seoul (Noryangjin Station, Line 1 Exit 2)',
    lat: 37.5108,
    lng: 126.9398,
    search: 'Noryangjin Fish Market 노량진수산시장 Seoul seafood',
    note: "One of the best places to visit in Seoul is Noryangjin Fish Market. It's like an aquarium where you can eat the exhibits. Unlike a lot of fish markets around the world, many of the fish are still alive in tanks. Because of that, it doesn't smell as rank as other markets.",
    hours: 'Open 24 hours; busiest Friday–Saturday evenings',
    tip: "Ask for SAN NAKJI (산낙지) in Section H if you want to try the squirming live octopus.",
    type: 'Live Seafood Market',
    blog: 'https://zenkimchi.com/tour-tips/noryangjin-fish-market-new-guide/',
    website: '',
  },

  {
    // SOURCE E: https://zenkimchi.com/tour-tips/noryangjin-fish-market-new-guide/
    // ✅ Verified exact words from source
    id: 41,
    nbhd: 'nbhd-noryangjin',
    name: 'Noryangjin Salted Seafood Marketplace',
    cat: 'market',
    emoji: '🦐',
    address: 'Inside Noryangjin Fish Market (2nd floor), Dongjak-gu, Seoul',
    lat: 37.5108,
    lng: 126.9395,
    search: 'Noryangjin salted seafood jeotgal market Seoul',
    note: "This is my favorite part of the whole market. All these fermented salted seafood. These are used to make kimchi, muchim (salads), to put on steamed pork wraps, and to just eat on the side. There are toothpicks available to try samples. The fun is just trying things. Don't even try to guess what they are. One of my guilty pleasures is the spicy smothered raw oysters with some buttery Ritz or Zec crackers.",
    hours: 'Daily 9am–8pm',
    tip: '',
    type: 'Fermented Seafood',
    blog: 'https://zenkimchi.com/tour-tips/noryangjin-fish-market-new-guide/',
    website: '',
  },

  {
    // SOURCE A+E: multiple ZenKimchi sources
    // ✅ Verified exact words from source
    id: 42,
    nbhd: 'nbhd-noryangjin',
    name: 'Noryangjin Cup Rice Road 컵밥거리',
    cat: 'market',
    emoji: '🍱',
    address: 'Noryangjin-dong, Dongjak-gu (exit Fish Market, walk east past subway station)',
    lat: 37.5118,
    lng: 126.9421,
    search: 'Noryangjin Cup Rice Road 컵밥거리 bomb rice Seoul',
    note: "One of my favorite secret corners of Seoul is Cup Rice Street (Cup Bap Geori 컵밥거리), right on the other side of Noryangjin Station. It's a row of streetside vendors catering to students studying for professional exams. Cheap. Lots of variety. Unique. And Good. Be on the lookout for the infamous Bomb Rice (Poktan Bap 폭탄밥). It's a super spicy variation of Bibiimbap.",
    hours: 'Daily 8am–10pm',
    tip: '',
    type: 'Student Street Food',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 43,
    nbhd: 'nbhd-noryangjin',
    name: 'Jeongin Myeonok 정인면옥',
    cat: 'food',
    emoji: '🍜',
    address: 'Yeouido, Yeongdeungpo-gu, Seoul',
    lat: 37.5219,
    lng: 126.9245,
    search: 'Jeongin Myeonok 정인면옥 naengmyeon Yeouido Seoul',
    note: "Watch out for the lunch lines here. It gets crowded. The naengmyeon is great, but it may also be because it's one of the few good restaurants in Yeouido.",
    hours: 'Mon–Sat, lunch only (closes early)',
    tip: '',
    type: 'Naengmyeon (Cold Buckwheat Noodles)',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  {
    // SOURCE F: https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/
    // ✅ Verified exact words from source
    id: 44,
    nbhd: 'nbhd-noryangjin',
    name: 'Lotte Department Store Basement 롯데백화점 지하',
    cat: 'market',
    emoji: '🏬',
    address: 'Lotte Department Store, Sogong-ro, Jung-gu, Seoul (Euljiro 1-ga Station)',
    lat: 37.5651,
    lng: 126.9819,
    search: 'Lotte Department Store Basement Seoul food court',
    note: "I do recommend department store basements for food journeys. Just sampling anything that's interesting. Great place for foodie souvenirs. The stalls are constantly changing, so it's pointless to try to list anything here. Just go check it out. If you're with a group of choosy eaters, and you can't escape them for your sanity, you'll likely find something to satisfy everyone here.",
    hours: 'Daily 10:30am–8pm (basement food hall)',
    tip: '',
    type: 'Department Store Food Hall',
    blog: 'https://zenkimchi.com/tour-tips/restaurants-myeong-dong-quick-guide/',
    website: '',
  },

  {
    // SOURCE G: https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
    // ✅ Verified exact words from source
    id: 45,
    nbhd: 'nbhd-noryangjin',
    name: 'Siloam Sauna 시로암사우나 & Dragon Hill Spa 용산드래곤힐스파',
    cat: 'landmark',
    emoji: '🥚',
    address: 'Siloam: Seoul Station area | Dragon Hill Spa: 40-713 Hangang-daero, Yongsan-gu',
    lat: 37.5145,
    lng: 126.9540,
    search: 'Siloam Sauna Dragon Hill Spa jjimjilbang Seoul',
    note: "Hit a real jjimjilbang like Siloam or Dragon Hill Spa. Sweat in a kiln, nap on a heated floor, snack on baked eggs and cold sikhye (rice punch). You'll emerge cleaner, softer, and slightly dehydrated.",
    hours: '24 hours',
    tip: '',
    type: 'Korean Bathhouse (Jjimjilbang)',
    blog: 'https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/',
    website: '',
  },

  {
    // SOURCE A: https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/
    // ✅ Verified exact words from source
    id: 46,
    nbhd: 'nbhd-noryangjin',
    name: 'Woo Lae Oak Noryangjin 우래옥 별관',
    cat: 'food',
    emoji: '🍥',
    address: 'Near Noryangjin area (see Naver Map for branches)',
    lat: 37.5115,
    lng: 126.9409,
    search: 'Woo Lae Oak 우래옥 Noryangjin naengmyeon Seoul',
    note: "Naengmyeon always hits the spot at the end of a barbecue meal, with a few squirts of vinegar and hot mustard from the bottles sitting next to you. That may be why places like Woo Lae Oak are famous for the naengmyeon. Fancy BBQ must follow with refined naengmyeon.",
    hours: 'Daily lunch and dinner',
    tip: '',
    type: 'Naengmyeon (Cold Noodles)',
    blog: 'https://zenkimchi.com/tour-tips/must-eat-korean-food-in-seoul-and-where-to-eat-it/',
    website: '',
  },

  // ─── NEW: CAFÉS ───────────────────────────────────────────────────────────

  {
    // SOURCE: https://zenkimchi.com/tour-tips/what-kind-of-traveler-are-you-heres-how-to-do-seoul-right/
    // ✅ Verified exact words from source
    id: 47,
    nbhd: 'nbhd-mapo',
    name: 'Anthracite Coffee 안트라시트',
    cat: 'cafe',
    emoji: '☕',
    address: '19 Tojeong-ro 37-gil, Hapjeong, Mapo-gu, Seoul (Hapjeong Station exit 1)',
    lat: 37.5504,
    lng: 126.9083,
    search: 'Anthracite Coffee 안트라시트 Hapjeong Seoul',
    note: "Work from: Anthracite (coffee and coal vibes), Daelim Changgo, or any place with an outlet and moody lighting. Seoul has insane Wi-Fi, but work culture is intense. If you camp at a café for 6 hours, buy a second drink. Otherwise, you're the foreign freeloader.",
    hours: 'Daily 9am–10pm',
    tip: '',
    type: 'Specialty Coffee',
    blog: 'https://zenkimchi.com/tour-tips/what-kind-of-traveler-are-you-heres-how-to-do-seoul-right/',
    website: 'https://anthracitecoffee.com',
  },

  {
    // SOURCE: https://zenkimchi.com/zenkimchi-get-immersed-in-korea/the-authentic-korean-chicken-and-beer-experience/
    // ✅ Verified exact words from source
    id: 48,
    nbhd: 'nbhd-hongdae',
    name: 'Convenience Store Bar 편의점 야외 술자리',
    cat: 'cafe',
    emoji: '🏪',
    address: 'Any GS25, CU or 7-Eleven near Hongdae, Mangwon or Euljiro — pick the one with outdoor tables',
    lat: 37.5560,
    lng: 126.9255,
    search: 'convenience store bar Seoul outdoor tables',
    note: "One of the great charms of living in South Korea is the convenience store bars. Tables usually sit outside convenience stores and bodegas (called 'Super' in Korean). Just grab some drinks, cups, and snacks. You have yourself a cheap all-night drinking spot.",
    hours: '24 hours',
    tip: "Triangle kimbap (₩1,200), instant ramen (₩900), cold beer (₩2,500). Korea's most democratic nightlife.",
    type: 'Outdoor Convenience Store Bar',
    blog: 'https://zenkimchi.com/zenkimchi-get-immersed-in-korea/the-authentic-korean-chicken-and-beer-experience/',
    website: '',
  },

  {
    // SOURCE: https://zenkimchi.com/tour-tips/the-curmudgeons-guide-to-insa-dong/
    // ✅ Verified exact words from source
    id: 49,
    nbhd: 'nbhd-jongno',
    name: 'Sol-ip Makgeolli Bar 솔입막걸리 (Insadong)',
    cat: 'pub',
    emoji: '🍶',
    address: 'North side of Insadong, across the street in a back alley, Jongno-gu',
    lat: 37.5752,
    lng: 126.9858,
    search: 'Sol-ip Makgeolli bar Insadong Seoul 솔입막걸리',
    note: "It's not a very Korean name, but you will never forget this place. It specializes in makgeolli from different regions of Korea in various flavors. The menu is upgraded Korean fusion, but the good kind of Korean fusion. Get the American Potato Pancake (미국감자전). Fresh grated potatoes fried up as a pancake, topped with sour cream and bacon.",
    hours: 'Daily from 5pm',
    tip: 'Upgrade your makgeolli with a dusting of pine needle powder on top (Sol-eep Makkolli 솔입막걸리).',
    type: 'Makgeolli Bar',
    blog: 'https://zenkimchi.com/tour-tips/the-curmudgeons-guide-to-insa-dong/',
    website: '',
  },

  // ─── NEW: LANDMARKS & EXPERIENCES ────────────────────────────────────────

  {
    // SOURCE G: https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
    // ✅ Verified exact words from source
    id: 50,
    nbhd: 'nbhd-jongno',
    name: 'Gyeongbokgung Palace 경복궁',
    cat: 'landmark',
    emoji: '🏯',
    address: '161 Sajik-ro, Jongno-gu, Seoul (Gyeongbokgung Station exit 5)',
    lat: 37.5796,
    lng: 126.9770,
    search: 'Gyeongbokgung Palace Seoul 경복궁',
    note: "Wear a hanbok (free entry), get there early (before the tour buses), and actually take in the architecture—not just the selfie potential. Don't bother with a rushed group tour. Instead, spend time wandering, then hit the National Folk Museum behind it.",
    hours: 'Wed–Mon 9am–6pm (closed Tue)',
    tip: 'Avoid peak weekend crowds; also skip the Changing of the Guard if you\'re low on time—it\'s more cosplay than ceremony.',
    type: 'Royal Palace',
    blog: 'https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/',
    website: 'https://www.royalpalace.go.kr',
  },

  {
    // SOURCE G: https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/
    // ✅ Verified exact words from source
    id: 51,
    nbhd: 'nbhd-jongno',
    name: 'Inwangsan & Eungbongsan Hike 인왕산',
    cat: 'landmark',
    emoji: '⛰️',
    address: 'Inwangsan: Hongjecheon-ro trailhead, Seodaemun-gu | Eungbongsan: Majang-dong, Seongdong-gu',
    lat: 37.5843,
    lng: 126.9543,
    search: 'Inwangsan hike Seoul mountain shrine',
    note: "Forget Namsan Tower. These hikes have better views, fewer tourists, and no overpriced elevator tickets. Plus, you might pass a shrine or a shamanic altar along the way.",
    hours: 'Open year-round; best at dawn',
    tip: 'Best for: Hikers, photographers, temple nerds. Avoid rainy days unless you like slipping on wet pine needles.',
    type: 'City Mountain Hike',
    blog: 'https://zenkimchi.com/tour-tips/what-to-actually-do-in-seoul-a-real-top-10-list-with-zero-bullsht/',
    website: '',
  },

  {
    // SOURCE: https://zenkimchi.com/tour-tips/10-unique-korean-souvenirs-seoul/
    // ✅ Verified exact words from source
    id: 52,
    nbhd: 'nbhd-itaewon',
    name: 'Hamilton Shirts 해밀턴 셔츠',
    cat: 'landmark',
    emoji: '👔',
    address: 'Itaewon-ro, Yongsan-gu, Seoul (near Hamilton Hotel)',
    lat: 37.5352,
    lng: 126.9948,
    search: 'Hamilton Shirts Itaewon Seoul tailor made',
    note: "I personally like to get tailor made shirts from Hamilton Shirts. They have my specs on file. I just choose the fabric and the style, and they ship it to me within ten days. They will even ship overseas–something to keep in mind.",
    hours: 'Mon–Sat 10am–7pm',
    tip: '',
    type: 'Custom Tailor',
    blog: 'https://zenkimchi.com/tour-tips/10-unique-korean-souvenirs-seoul/',
    phone: '02-792-5596',
    website: '',
  },

  {
    // SOURCE: https://zenkimchi.com/category/tour-tips/ (Jan 2026 price guide)
    // ✅ Verified exact words from source
    id: 53,
    nbhd: 'nbhd-euljiro',
    name: 'Dongmyo Flea Market 동묘벼룩시장',
    cat: 'market',
    emoji: '🕹️',
    address: 'Dongmyo-dong, Jongno-gu, Seoul (Dongmyo Station, Line 1 & 6, exit 3)',
    lat: 37.5721,
    lng: 127.0163,
    search: 'Dongmyo flea market 동묘 벼룩시장 Seoul vintage',
    note: "Instead of battling crowds in Myeongdong, head east to Dongmyo. It's a sprawling flea market that's part thrift paradise, part living museum of random Korean antiques. Think vintage leather jackets from the '80s next to dusty LPs and mountains of ajumma pants. You never know what you'll find, and that's half the fun. More importantly, it still feels real—no cloned cosmetic shops or tourist-pandering stalls in sight.",
    hours: 'Daily 9am–6pm (best Sat–Sun)',
    tip: 'If you want an adventure (and bargains), Dongmyo is the treasure hunt you didn\'t know you needed.',
    type: 'Vintage Flea Market',
    blog: 'https://zenkimchi.com/category/tour-tips/',
    website: '',
  },

];
