// ── Photo attribution per place id (Nashville) ──
// Overlapping places reuse the Holston House credits (IDs match across both guides).
// Nashville-only landmarks/parks use CC images; the 6 cafés/bars use the venue's own
// photo (from their site/Instagram) credited to them.
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
  12: { author: "Antony-22", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Tennessee_Capitol_Mall_2022a.jpg", venue:false },
  13: { author: "Babychan", license: "", url: "https://www.babychancafe.com", venue:true },
  14: { author: "Michael Rivera", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Frist_Center_for_the_Visual_Arts_(Northwest_face).JPG", venue:false },
  15: { author: "L.A. Jackson", license: "", url: "https://www.lajacksonbar.com", venue:true },
  16: { author: "The Catbird Seat", license: "", url: "https://www.thecatbirdseatrestaurant.com", venue:true },
  17: { author: "Biscuit Love", license: "", url: "https://biscuitlove.com", venue:true },
  18: { author: "The Patterson House", license: "", url: "https://www.thepattersonnashville.com", venue:true },
  19: { author: "Nick Shields", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Station_Inn_Nashville_(8729882676).jpg", venue:false },
  20: { author: "Attaboy Nashville", license: "", url: "https://attaboy.us", venue:true },
  21: { author: "Kisser", license: "", url: "https://www.kisserrestaurant.com", venue:true },
  22: { author: "Butcher & Bee", license: "", url: "https://butcherandbee.com", venue:true },
  23: { author: "The Pharmacy Burger Parlor & Beer Garden", license: "", url: "https://thepharmacyburger.com", venue:true },
  24: { author: "Barista Parlor", license: "", url: "https://baristaparlor.com", venue:true },
  25: { author: "Mas Tacos Por Favor", license: "", url: "https://www.instagram.com/mastacos", venue:true },
  26: { author: "Bad Idea", license: "", url: "https://badideanashville.com", venue:true },
  27: { author: "MaxKelley620", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Shelby_Bottoms_Greenway,_Nashville,_TN.jpg", venue:false },
  28: { author: "Frothy Monkey", license: "", url: "https://frothymonkey.com/locations/12south-nashville-tn/", venue:true },
  29: { author: "Locust", license: "", url: "https://locustnashville.com", venue:true },
  30: { author: "Five Daughters Bakery", license: "", url: "https://fivedaughtersbakery.com", venue:true },
  31: { author: "Www78", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Sunnyside_Mansion.JPG", venue:false },
  32: { author: "Bastion", license: "", url: "https://bastionnashville.com", venue:true },
  33: { author: "Fonda on 12th", license: "", url: "https://fondanashville.com", venue:true },
  34: { author: "Mayur Phadtare", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:The_Parthenon,_Nashville.JPG", venue:false },
  35: { author: "The Bluebird Cafe", license: "", url: "https://www.bluebirdcafe.com", venue:true },
  36: { author: "Fido", license: "", url: "https://www.bongojava.com/pages/fido", venue:true },
  37: { author: "EVula", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:WTN_EVula_135.jpg", venue:false },
  38: { author: "Nelson's Green Brier Distillery", license: "", url: "https://greenbrierdistillery.com", venue:true },
  39: { author: "Prayitno (prayitnophotography)", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Recording_Session_at_RCA_Studio_B_(2015-04-09_11.01.48_by_prayitnophotography).jpg", venue:false },
  40: { author: "Pancake Pantry", license: "", url: "https://www.thepancakepantry.com", venue:true },
  41: { author: "The Listening Room Cafe", license: "", url: "https://www.instagram.com/listeningroomcafe", venue:true },
  42: { author: "Skull's Rainbow Room", license: "", url: "https://skullsrainbowroom.com", venue:true },
  43: { author: "Rudy's Jazz Room", license: "", url: "https://rudysjazzroom.com", venue:true },
  44: { author: "Holyhootenany", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Justin_Amaral_at_The_5_Spot,_Nashville,_TN.jpg", venue:false },
  45: { author: "3rd & Lindsley", license: "", url: "https://3rdandlindsley.com", venue:true },
  46: { author: "Andysedgley", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Downtown_from_Siegenthaler.jpg", venue:false },
  47: { author: "Bobak Ha'Eri", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:101207-Nashville-GrandOleOpry-001.JPG", venue:false },
  48: { author: "MICHAEL BROWN", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Percy_Warner_Park_(3230557452).jpg", venue:false },
  49: { author: "Spheroidite", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Radnor_Lake_panorama.jpg", venue:false },
  50: { author: "RL0919", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Walking_path_in_the_gardens_of_Cheekwood.png", venue:false }
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
