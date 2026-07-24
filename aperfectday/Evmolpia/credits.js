// ── Photo attribution per place id (Hotel Evmolpia / Plovdiv) ──
// CC / public-domain images from Wikimedia Commons.
//   author = photographer/uploader, license = CC license, url = Commons file page.
// Only the seven Plovdiv landmarks currently have photos; all other places
// show the category colour + emoji until a licensed or venue photo is added.
const PHOTO_CREDITS = {
  1: { author: "MrPanyGoff", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Roman_Theatre_Plovdiv_3.jpg", venue:false },
  2: { author: "Laurens R. Krol", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:2016-07-30_Bulgaria,_Plovdiv,_Nebet_Tepe_DSC_9103_DxO_1.jpg", venue:false },
  3: { author: "Klearchos Kapoutsis", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Regional_Ethnographic_Museum,_Plovdiv.jpg", venue:false },
  4: { author: "Whitepixels", license: "CC0 (Public Domain)", url: "https://commons.wikimedia.org/wiki/File:Plovdiv_Balabanov_house_01.jpg", venue:false },
  5: { author: "Laurens R. Krol", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:2016-07-30_Bulgaria,_Plovdiv,_Philippopolis_stadium_DSC_9038_DxO_PS.jpg", venue:false },
  6: { author: "Explorer1940", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Plovdiv_--_Dzhumaya_Mosque_01.jpg", venue:false },
  7: { author: "Predavatel", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Plovdiv_Kapana.jpg", venue:false },
  9:  { author: "Aylyakria", license: "", url: "https://aylyakria.com/en/", venue:true },
  10: { author: "Philippopolis Restaurant-Garden", license: "", url: "https://www.philippopolis.com/en", venue:true },
  12: { author: "Smokini", license: "", url: "https://smokini.bg/en", venue:true },
  13: { author: "Hemingway", license: "", url: "https://hemingway.bg/en/home/", venue:true },
  15: { author: "Artnews Cafe", license: "", url: "https://artnewscafe.com/", venue:true },
  17: { author: "Cat & Mouse", license: "", url: "https://catandmouse.bg/", venue:true },
  19: { author: "Andromeda Art", license: "", url: "https://andromeda-art.com/en/", venue:true },
  21: { author: "Michael Desnoyelles", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Bachkovo_Monastery_-_Inside_court_and_church.jpg", venue:false },
  22: { author: "Eric T Gunther", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Asen's_Fortress_view_from_road.JPG", venue:false },
  24: { author: "Villa Yustina", license: "", url: "https://villayustina.com/en/", venue:true },
  25: { author: "Spasimir Pilev", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Red_Church_in_Perushtitsa_2020_01.jpg", venue:false },
  27: { author: "Explorer1940", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Plovdiv_--_Church_of_St_Constantine_and_Helena.jpg", venue:false },
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
