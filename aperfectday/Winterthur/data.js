// A Perfect Day — Winterthur Museum, Garden & Library (Delaware)
// data.js — English demo build. Each place carries an en{} block; i18n.js copies
//   the active language into p.name / p.type(role) / p.address(zone) / p.note(desc) / p.tip.
//   The guide is multilingual-ready — add ru:{}, de:{}, fr:{} blocks later to go live in more languages.
//
// ⚠️ ACCURACY: every description, detail and set of hours below is drawn from
//    winterthur.org (verified July 2026). Please keep it that way — this guide
//    must represent Winterthur exactly. Coordinates are approximate/illustrative
//    for this demo and should be replaced with surveyed positions before launch.
//
// Categories: pavilion=House & Galleries · outdoor=Gardens · hall=Family · heritage=Tram Tour · service=Eat & Shop
// Zones (nbhd): core=Museum & House · east=The Garden · park=Visitor Center

const PLACES = [
  {
    id: 1, nbhd: "core", cat: "pavilion", emoji: "🏛️",
    lat: 39.80612, lng: -75.60056,
    hours: "Tue–Sun 10:00–15:30",
    website: "https://www.winterthur.org/exhibitions-and-collections/museum/galleries/",
    en: {
      name: "Winterthur House & Galleries",
      role: "Historic house & galleries",
      zone: "Museum & House",
      desc: "Henry Francis du Pont’s estate home and the heart of Winterthur. The galleries highlight America’s history, cultural heritage, and design through objects du Pont collected together with those acquired by curators since the museum’s founding in 1951. The first- and second-floor galleries change frequently to showcase new items and new research. See it on the self-paced house tour, “An American Legacy.”",
      tip: "House tours run Tue–Sun until 3:30 pm — start here before the galleries close."
    }
  },
  {
    id: 2, nbhd: "core", cat: "pavilion", emoji: "🍲",
    lat: 39.80607, lng: -75.60048,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/Dorrance_Gallery_Detail_East_Side-1024x819.jpg",
    website: "https://www.winterthur.org/campbell-collection-of-soup-tureens-2/",
    en: {
      name: "Campbell Collection of Soup Tureens",
      role: "Decorative-arts gallery",
      zone: "Museum & House",
      desc: "Tureens artfully crafted in fascinating forms — sculpted metals, precious porcelains and elegant earthenwares made in Europe, Asia and America, with dates ranging from 1720 to modern times. The collection began in 1966 with John T. Dorrance Jr. and W. B. Murphy; it came to Winterthur and the gallery opened in 1997.",
      tip: "In the Dorrance Gallery — included with general admission."
    }
  },
  {
    id: 3, nbhd: "park", cat: "heritage", emoji: "🚋",
    lat: 39.80913198, lng: -75.60401548,
    hours: "Tue–Sun 10:00–16:00",
    img: "https://www.winterthur.org/wp-content/uploads/Winterthur-August2022-BeccaMathias-7952-scaled.jpg",
    website: "https://www.winterthur.org/garden-tram/",
    en: {
      name: "Garden Tram Tour · Board Here",
      role: "30-minute narrated tram",
      zone: "Visitor Center",
      desc: "A 30-minute narrated tram tour that begins at the Visitor Center and ends at the museum, with a stop in Enchanted Woods — an easy way to see highlights of the garden from your seat. Included with admission; members free. Weather and space permitting.",
      tip: "A relaxed way to get your bearings across the 60-acre garden before exploring on foot."
    }
  },
  {
    id: 4, nbhd: "east", cat: "hall", emoji: "🧚",
    lat: 39.80621756, lng: -75.59788418,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/enchanted-woods-rob-cardillo-rcp_180719_3562_web-small.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/enchanted-woods/",
    en: {
      name: "Enchanted Woods",
      role: "Children’s fairy-tale garden",
      zone: "The Garden",
      desc: "A fairy-tale garden for children and families. Designed to look as though it were created by fairies, this three-acre plot covered by majestic oak trees has several play areas to climb in, on, and over — including a Faerie Cottage with a thatched roof, a giant Bird’s Nest, and an Acorn Tearoom for make-believe tea parties. Enchanted Woods encourages imaginative play and creativity.",
      tip: "Look for the Fairy Ring, Tulip Tree House, Frog Hollow and Water’s Edge."
    }
  },
  {
    id: 5, nbhd: "east", cat: "outdoor", emoji: "🌼",
    lat: 39.8071, lng: -75.6006,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/garden_04-2021-leitch-002-2.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "March Bank",
      role: "Naturalistic bulb garden",
      zone: "The Garden",
      desc: "Henry Francis du Pont began planting the March Bank in 1902, at age 22. It has grown into an extensive naturalistic display — a showcase for millions of late-winter bulbs and one of the last 20th-century wild gardens in the United States. The show runs from white snowdrops and winter aconite through a carpet of blue squills and glory-of-the-snow, then daffodils, crocus and windflowers.",
      tip: "The garden’s earliest and one of its most beloved displays — peak show late winter into early spring."
    }
  },
  {
    id: 6, nbhd: "east", cat: "outdoor", emoji: "🌸",
    lat: 39.8054, lng: -75.5992,
    hours: "Tue–Sun 10:00–17:00",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Azalea Woods",
      role: "Woodland garden",
      zone: "The Garden",
      desc: "Eight acres that in mid-May fill with white, coral, pink and red azalea cultivars alongside peach and salmon rhododendrons, Spanish bluebells and dame’s rocket. Earlier, in April, white trilliums, mayapples and yellow primroses carpet the woodland floor beneath the tall trees.",
      tip: "Peak bloom is mid-May — one of the garden’s signature moments."
    }
  },
  {
    id: 7, nbhd: "east", cat: "outdoor", emoji: "🌷",
    lat: 39.807051, lng: -75.597132,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/Garden_04-2021-Cardillo-002-2-1024x683.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Sundial Garden",
      role: "Flowering shrub garden",
      zone: "The Garden",
      desc: "In spring, white and pink magnolias bloom with spireas, flowering quince and flowering cherries. By early May, cascading white spirea, fragrant viburnums and lilacs take over, and the theme holds to white and lavender with snowball viburnums, lilacs and the princess trees in bloom.",
      tip: "Come for the fragrant lilacs from late April into May."
    }
  },
  {
    id: 8, nbhd: "east", cat: "outdoor", emoji: "🌿",
    lat: 39.80617444, lng: -75.596727,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/garden_04-2019-schneck-061-1024x683.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Quarry Garden",
      role: "Bog & woodland garden",
      zone: "The Garden",
      desc: "A former quarry transformed into a bog and woodland garden with a year-round succession of bloom. Late-winter snowflakes and witch-hazels give way to glory-of-the-snow and cornelian cherry dogwoods, then wild columbines and primulas in yellow, orange and pink, with red cardinal flower by August and the reds of black gum and dogwood in late autumn.",
      tip: ""
    }
  },
  {
    id: 9, nbhd: "east", cat: "outdoor", emoji: "🌼",
    lat: 39.80745, lng: -75.60015,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/garden_04-2021-cardillo-006-2-1024x683.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Winterhazel Walk",
      role: "Early-spring walk",
      zone: "The Garden",
      desc: "In early spring the walk dazzles with pale yellow winter-hazels and lavender and pink Korean rhododendrons breaking bud together, joined by lavender corydalis and white-and-burgundy lenten rose. Chartreuse hellebores appear from early March; in late autumn, golden winter-hazel foliage meets crimson azalea leaves.",
      tip: ""
    }
  },
  {
    id: 10, nbhd: "east", cat: "outdoor", emoji: "🌲",
    lat: 39.8066, lng: -75.601,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/Garden_06-2018-Leitch-008.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Pinetum",
      role: "Evergreen garden & Quince Walk",
      zone: "The Garden",
      desc: "Beneath mature evergreens, the pink blossoms of royal azaleas and the Quince Walk — flowering quince in pink, salmon, white and red. Later, the sweet fragrance of Viburnum carlesii, white pearlbushes and crabapples enliven the deep shade of the conifers.",
      tip: "Royal azaleas and the Quince Walk are at their best mid-April into May."
    }
  },
  {
    id: 11, nbhd: "east", cat: "outdoor", emoji: "🌺",
    lat: 39.8059, lng: -75.6004,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/garden_04-2021-leitch-015.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Magnolia Bend",
      role: "Seasonal garden",
      zone: "The Garden",
      desc: "Spectacular drifts of daffodils amid forsythia and pink flowering cherries in April; arching deutzia and spirea with blue-and-white iris in June; white oakleaf hydrangeas and rugosa roses in summer; then orange-red Japanese maples in late autumn.",
      tip: "The daffodil drifts peak in late April."
    }
  },
  {
    id: 12, nbhd: "east", cat: "outdoor", emoji: "🌸",
    lat: 39.8069, lng: -75.5989,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/Winterthur-May2024-7441-scaled.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Peony Garden",
      role: "Peony display",
      zone: "The Garden",
      desc: "In mid-May, early peonies open in soft ivory, salmon, yellow and red, set off by pink weigela.",
      tip: "A short, glorious window — best mid- to late May."
    }
  },
  {
    id: 13, nbhd: "east", cat: "outdoor", emoji: "💧",
    lat: 39.80652802, lng: -75.59960704,
    hours: "Tue–Sun 10:00–17:00",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Reflecting Pool",
      role: "Water garden",
      zone: "The Garden",
      desc: "A tranquil pool with its own cooling sounds, surrounded in summer by containers filled with colourful annuals. By late summer it is lovely with white blossoms of hydrangeas and crepe myrtles combined with pink abelias and hardy begonias.",
      tip: "A restful pause point — loveliest in summer."
    }
  },
  {
    id: 14, nbhd: "east", cat: "outdoor", emoji: "🍁",
    lat: 39.808, lng: -75.5985,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/garden_04-2021-cardillo-006-2-1024x683.jpg",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    en: {
      name: "Oak Hill",
      role: "Woodland vistas",
      zone: "The Garden",
      desc: "In mid-May the bright reds of azaleas and the flame buckeye pair with lilacs and gold, white and pink native azaleas. In late autumn, golden hardy-orange, orange-red tea viburnums and violet beautyberries command attention over breathtaking vistas of the surrounding woodlands.",
      tip: "Come in fall for the woodland vistas."
    }
  },
  {
    id: 15, nbhd: "park", cat: "service", emoji: "☕",
    lat: 39.80899285, lng: -75.60396207,
    hours: "Tue–Sun 11:00–15:00",
    website: "https://www.winterthur.org/dining-options/",
    en: {
      name: "Visitor Center Café",
      role: "Café",
      zone: "Visitor Center",
      desc: "Grab-and-go sandwiches, wraps and salads; soup of the day; sweet treats and snacks; coffee, tea and assorted bottled beverages. Picnicking is also welcome on the grounds.",
      tip: "Open 11 am–3 pm — plan lunch around it, or bring a picnic."
    }
  },
  {
    id: 16, nbhd: "park", cat: "service", emoji: "🛍️",
    lat: 39.80890447, lng: -75.60370794,
    hours: "Tue–Sun 10:00–17:00",
    img: "https://www.winterthur.org/wp-content/uploads/DSC_5047-16x9-2-1024x576.jpg",
    website: "https://www.winterthur.org/shop/",
    en: {
      name: "Museum Store",
      role: "Shop",
      zone: "Visitor Center",
      desc: "The Winterthur Museum Store, open the full estate day for gifts, books and garden-inspired finds at the Visitor Center.",
      tip: ""
    }
  }
,
  {
    id: 17, nbhd: "east", cat: "heritage", emoji: "🚋",
    lat: 39.80635, lng: -75.59805,
    hours: "Tue–Sun 10:00–16:00",
    img: "https://www.winterthur.org/wp-content/uploads/enchanted-woods-rob-cardillo-rcp_180719_3562_web-small.jpg",
    website: "https://www.winterthur.org/garden-tram/",
    en: {
      name: "Tram Stop · Enchanted Woods",
      role: "Garden tram stop",
      zone: "The Garden",
      desc: "The narrated garden tram tour stops here at Enchanted Woods — hop off to explore the children's fairy-tale garden, then reboard, or carry on to the museum.",
      tip: "A great place to break the ride if you're visiting with children."
    }
  },
  {
    id: 18, nbhd: "core", cat: "heritage", emoji: "🚋",
    lat: 39.80620, lng: -75.60075,
    hours: "Tue–Sun 10:00–16:00",
    img: "https://www.winterthur.org/wp-content/uploads/Winterthur-August2022-BeccaMathias-7952-scaled.jpg",
    website: "https://www.winterthur.org/garden-tram/",
    en: {
      name: "Tram Stop · Museum",
      role: "Garden tram stop",
      zone: "Museum & House",
      desc: "The garden tram tour ends here at the museum. From the Visitor Center, the 30-minute narrated ride carries you across the 60-acre garden to the house.",
      tip: "Ride out from the Visitor Center, then explore the house and galleries on foot."
    }
  },
  {
    id: 19, nbhd: "east", cat: "outdoor", emoji: "🌳",
    lat: 39.806737, lng: -75.596086,
    hours: "Tue–Sun 10:00–17:00",
    website: "https://www.winterthur.org/exhibitions-and-collections/garden/",
    img: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20400%20300%27%3E%3Crect%20width%3D%27400%27%20height%3D%27300%27%20fill%3D%27%232f5347%27/%3E%3Cg%20fill%3D%27%23e6c34d%27%3E%3Crect%20x%3D%27192%27%20y%3D%27168%27%20width%3D%2716%27%20height%3D%2796%27%20rx%3D%274%27/%3E%3Ccircle%20cx%3D%27200%27%20cy%3D%27120%27%20r%3D%2758%27/%3E%3Ccircle%20cx%3D%27150%27%20cy%3D%27146%27%20r%3D%2740%27/%3E%3Ccircle%20cx%3D%27250%27%20cy%3D%27146%27%20r%3D%2740%27/%3E%3Ccircle%20cx%3D%27200%27%20cy%3D%2784%27%20r%3D%2738%27/%3E%3C/g%3E%3C/svg%3E",
    en: {
      name: "Sycamore with Cement Core",
      role: "Landmark specimen tree",
      zone: "The Garden",
      desc: "A beloved old sycamore on the garden route near the Sundial Garden — a favourite estate landmark, named for the cement core within its trunk.",
      tip: ""
    }
  },
  {
    id: 20, nbhd: "east", cat: "restroom", emoji: "🚻",
    lat: 39.806107, lng: -75.596853,
    hours: "Tue–Sun 10:00–17:00",
    website: "",
    img: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20400%20260%27%3E%3Crect%20width%3D%27400%27%20height%3D%27260%27%20fill%3D%27%232f5347%27/%3E%3Crect%20x%3D%27198%27%20y%3D%2755%27%20width%3D%274%27%20height%3D%27150%27%20fill%3D%27%23e6c34d%27/%3E%3Cg%20fill%3D%27%23f7f1e8%27%3E%3Ccircle%20cx%3D%27140%27%20cy%3D%2772%27%20r%3D%2717%27/%3E%3Crect%20x%3D%27123%27%20y%3D%2796%27%20width%3D%2734%27%20height%3D%2752%27%20rx%3D%278%27/%3E%3Crect%20x%3D%27128%27%20y%3D%27142%27%20width%3D%2710%27%20height%3D%2758%27%20rx%3D%273%27/%3E%3Crect%20x%3D%27142%27%20y%3D%27142%27%20width%3D%2710%27%20height%3D%2758%27%20rx%3D%273%27/%3E%3C/g%3E%3Cg%20fill%3D%27%23f7f1e8%27%3E%3Ccircle%20cx%3D%27260%27%20cy%3D%2772%27%20r%3D%2717%27/%3E%3Cpath%20d%3D%27M260%2094%20L232%20164%20H288%20Z%27/%3E%3Crect%20x%3D%27250%27%20y%3D%27160%27%20width%3D%279%27%20height%3D%2748%27%20rx%3D%273%27/%3E%3Crect%20x%3D%27261%27%20y%3D%27160%27%20width%3D%279%27%20height%3D%2748%27%20rx%3D%273%27/%3E%3C/g%3E%3C/svg%3E",
    en: { name: "Restrooms · Garden", role: "Visitor restroom", zone: "The Garden",
      desc: "Public restrooms in the garden, near the Sundial Garden.", tip: "" }
  },
  {
    id: 21, nbhd: "park", cat: "restroom", emoji: "🚻",
    lat: 39.80900, lng: -75.60380,
    hours: "Tue–Sun 10:00–17:00",
    website: "",
    img: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20400%20260%27%3E%3Crect%20width%3D%27400%27%20height%3D%27260%27%20fill%3D%27%232f5347%27/%3E%3Crect%20x%3D%27198%27%20y%3D%2755%27%20width%3D%274%27%20height%3D%27150%27%20fill%3D%27%23e6c34d%27/%3E%3Cg%20fill%3D%27%23f7f1e8%27%3E%3Ccircle%20cx%3D%27140%27%20cy%3D%2772%27%20r%3D%2717%27/%3E%3Crect%20x%3D%27123%27%20y%3D%2796%27%20width%3D%2734%27%20height%3D%2752%27%20rx%3D%278%27/%3E%3Crect%20x%3D%27128%27%20y%3D%27142%27%20width%3D%2710%27%20height%3D%2758%27%20rx%3D%273%27/%3E%3Crect%20x%3D%27142%27%20y%3D%27142%27%20width%3D%2710%27%20height%3D%2758%27%20rx%3D%273%27/%3E%3C/g%3E%3Cg%20fill%3D%27%23f7f1e8%27%3E%3Ccircle%20cx%3D%27260%27%20cy%3D%2772%27%20r%3D%2717%27/%3E%3Cpath%20d%3D%27M260%2094%20L232%20164%20H288%20Z%27/%3E%3Crect%20x%3D%27250%27%20y%3D%27160%27%20width%3D%279%27%20height%3D%2748%27%20rx%3D%273%27/%3E%3Crect%20x%3D%27261%27%20y%3D%27160%27%20width%3D%279%27%20height%3D%2748%27%20rx%3D%273%27/%3E%3C/g%3E%3C/svg%3E",
    en: { name: "Restrooms · Visitor Center", role: "Visitor restroom", zone: "Visitor Center",
      desc: "Public restrooms at the Visitor Center, by the café and shop.", tip: "" }
  },
  {
    id: 22, nbhd: "core", cat: "restroom", emoji: "🚻",
    lat: 39.80625, lng: -75.60045,
    hours: "Tue–Sun 10:00–17:00",
    website: "",
    img: "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%20400%20260%27%3E%3Crect%20width%3D%27400%27%20height%3D%27260%27%20fill%3D%27%232f5347%27/%3E%3Crect%20x%3D%27198%27%20y%3D%2755%27%20width%3D%274%27%20height%3D%27150%27%20fill%3D%27%23e6c34d%27/%3E%3Cg%20fill%3D%27%23f7f1e8%27%3E%3Ccircle%20cx%3D%27140%27%20cy%3D%2772%27%20r%3D%2717%27/%3E%3Crect%20x%3D%27123%27%20y%3D%2796%27%20width%3D%2734%27%20height%3D%2752%27%20rx%3D%278%27/%3E%3Crect%20x%3D%27128%27%20y%3D%27142%27%20width%3D%2710%27%20height%3D%2758%27%20rx%3D%273%27/%3E%3Crect%20x%3D%27142%27%20y%3D%27142%27%20width%3D%2710%27%20height%3D%2758%27%20rx%3D%273%27/%3E%3C/g%3E%3Cg%20fill%3D%27%23f7f1e8%27%3E%3Ccircle%20cx%3D%27260%27%20cy%3D%2772%27%20r%3D%2717%27/%3E%3Cpath%20d%3D%27M260%2094%20L232%20164%20H288%20Z%27/%3E%3Crect%20x%3D%27250%27%20y%3D%27160%27%20width%3D%279%27%20height%3D%2748%27%20rx%3D%273%27/%3E%3Crect%20x%3D%27261%27%20y%3D%27160%27%20width%3D%279%27%20height%3D%2748%27%20rx%3D%273%27/%3E%3C/g%3E%3C/svg%3E",
    en: { name: "Restrooms · Museum", role: "Visitor restroom", zone: "Museum & House",
      desc: "Public restrooms at the museum.", tip: "" }
  }
];
