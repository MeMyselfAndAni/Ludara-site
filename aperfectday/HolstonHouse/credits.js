// ── Photo attribution per place id (Holston House / Nashville) ──
// Two kinds of entry:
//   CC images  : author = photographer, license = CC license, url = Wikimedia Commons file page.
//   venue:true : the venue’s own website photo, credited to the venue, url = their site (no CC license).
// Places with no entry here show no credit line.
const PHOTO_CREDITS = {
  1: { author: "Zpb52", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Ryman_Auditorium_interior.JPG", venue:false },
  2: { author: "Michael Rivera", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Country_Music_Hall_of_Fame_(Northwest_face).JPG", venue:false },
  3: { author: "Warren LeMay", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:National_Museum_of_African_American_Music,_Fifth_%2B_Broadway,_Broadway_and_5th_Avenue,_Nashville,_TN_(54384524318).jpg", venue:false },
  4: { author: "Kyle Van Horn", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Hatch_Show_Print_July_2010_exterior.jpg", venue:false },
  5: { author: "Ttotallytexan", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Tootsies_2015.jpg", venue:false },
  6: { author: "Mx. Granger", license: "CC0 (Public Domain)", url: "https://commons.wikimedia.org/wiki/File:Robert%27s_Western_World_interior.jpg", venue:false },
  7: { author: "Crema Coffee Roasters", license: "", url: "https://crema-coffee.com", venue:true },
  8: { author: "City House", license: "", url: "https://cityhousenashville.com", venue:true },
  9: { author: "Rolf & Daughters", license: "", url: "https://rolfanddaughters.com", venue:true },
  10: { author: "Henrietta Red", license: "", url: "https://henriettared.com", venue:true },
  11: { author: "Nashville Farmers' Market", license: "", url: "https://nashvillefarmersmarket.org", venue:true },
  13: { author: "Babychan", license: "", url: "https://www.babychancafe.com", venue:true },
  14: { author: "Michael Rivera", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Frist_Center_for_the_Visual_Arts_(Northwest_face).JPG", venue:false },
  16: { author: "The Catbird Seat", license: "", url: "https://www.thecatbirdseatrestaurant.com", venue:true },
  17: { author: "Biscuit Love", license: "", url: "https://biscuitlove.com", venue:true },
  18: { author: "The Patterson House", license: "", url: "https://www.thepattersonnashville.com", venue:true },
  19: { author: "Nick Shields", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Station_Inn_Nashville_(8729882676).jpg", venue:false },
  20: { author: "Attaboy Nashville", license: "", url: "https://attaboy.us", venue:true },
  21: { author: "Kisser", license: "", url: "https://www.kisserrestaurant.com", venue:true },
  23: { author: "The Pharmacy Burger Parlor & Beer Garden", license: "", url: "https://thepharmacyburger.com", venue:true },
  26: { author: "Bad Idea", license: "", url: "https://badideanashville.com", venue:true },
  29: { author: "Locust", license: "", url: "https://locustnashville.com", venue:true },
  32: { author: "Bastion", license: "", url: "https://bastionnashville.com", venue:true },
  33: { author: "Fonda on 12th", license: "", url: "https://fondanashville.com", venue:true },
  34: { author: "Mayur Phadtare", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:The_Parthenon,_Nashville.JPG", venue:false },
  35: { author: "The Bluebird Cafe", license: "", url: "https://www.bluebirdcafe.com", venue:true },
  37: { author: "EVula", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:WTN_EVula_135.jpg", venue:false },
  39: { author: "Prayitno (prayitnophotography)", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Recording_Session_at_RCA_Studio_B_(2015-04-09_11.01.48_by_prayitnophotography).jpg", venue:false },
  40: { author: "Pancake Pantry", license: "", url: "https://www.thepancakepantry.com", venue:true },
  41: { author: "The Listening Room Cafe", license: "", url: "https://thelisteningroomcafe.com", venue:true },
  42: { author: "Skull's Rainbow Room", license: "", url: "https://skullsrainbowroom.com", venue:true },
  43: { author: "Rudy's Jazz Room", license: "", url: "https://rudysjazzroom.com", venue:true },
  45: { author: "3rd & Lindsley", license: "", url: "https://3rdandlindsley.com", venue:true },
  50: { author: "RL0919", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Walking_path_in_the_gardens_of_Cheekwood.png", venue:false },
  51: { author: "Milk and Honey", license: "", url: "https://milkandhoneynashville.com", venue:true },
  52: { author: "Another Broken Egg Cafe", license: "", url: "https://anotherbrokenegg.com", venue:true },
  53: { author: "The Farmhouse", license: "", url: "https://thefarmhousetn.com", venue:true },
  54: { author: "One Kitchen", license: "", url: "https://www.1hotels.com/nashville/taste/1-kitchen", venue:true },
  55: { author: "All'Antico Vinaio", license: "", url: "https://allanticovinaiousa.com", venue:true },
  56: { author: "Blue Sushi Sake Grill", license: "", url: "https://bluesushisakegrill.com", venue:true },
  57: { author: "The Finch", license: "", url: "https://thefinchnashville.com", venue:true },
  58: { author: "Assembly Food Hall", license: "", url: "https://assemblyfoodhall.com", venue:true },
  59: { author: "Pinewood Social", license: "", url: "https://pinewoodsocial.com", venue:true },
  60: { author: "Bourbon Steak", license: "", url: "https://bourbonsteak.com/location/nashville", venue:true },
  62: { author: "Maiz de la Vida", license: "", url: "https://maizdelavida.com", venue:true },
  63: { author: "Eddie V's Prime Seafood", license: "", url: "https://eddiev.com", venue:true },
  64: { author: "Peg Leg Porker", license: "", url: "https://peglegporker.com", venue:true },
  65: { author: "Martin's Bar-B-Que Joint", license: "", url: "https://martinsbbqjoint.com", venue:true },
  66: { author: "Red Phone Booth", license: "", url: "https://redphonebooth.com", venue:true },
  67: { author: "Bourbon Street Blues and Boogie Bar", license: "", url: "https://bourbonstreetbluesandboogiebar.com", venue:true },
  68: { author: "The Stage on Broadway", license: "", url: "https://thestageonbroadway.com", venue:true },
  69: { author: "The Basement East", license: "", url: "https://thebasementnashville.com", venue:true },
  70: { author: "Nashville Old Town Trolley Tours", license: "", url: "https://www.trolleytours.com/nashville", venue:true },
  71: { author: "Michael Rivera", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Johnny_Cash_Museum,_Nashville.JPG", venue:false },
  72: { author: "12 South", license: "", url: "https://www.visitmusiccity.com/nashville-neighborhoods/12south", venue:true },
  73: { author: "Fifth + Broadway", license: "", url: "https://fifthandb.com", venue:true },
  74: { author: "Boot Country", license: "", url: "https://www.twofreeboots.com", venue:true },
  75: { author: "Tecovas", license: "", url: "https://www.tecovas.com/stores/nashville-tn-broadway", venue:true },
  76: { author: "Boot Barn", license: "", url: "https://www.bootbarn.com", venue:true },
  77: { author: "Big Time Boots", license: "", url: "https://www.trailwestnashville.com/big-time-boots", venue:true },
  78: { author: "Betty Boots", license: "", url: "https://www.trailwestnashville.com/betty-boots", venue:true },
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
