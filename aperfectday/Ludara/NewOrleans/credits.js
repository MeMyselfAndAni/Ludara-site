// ── Photo attribution per place id (New Orleans) ──
// CC image  : { author: 'Name', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:...' }
// venue     : { author: 'Venue Name', license: '', url: 'https://venue-site.com', venue:true }
// CC images verified on the Commons File page (author + license read verbatim). Venue entries use the venue's own website photo.
const PHOTO_CREDITS = {
  1:  { author: "Brendan J. O'Reilly", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:St._Louis_Cathedral,_New_Orleans.JPG" },
  2:  { author: "Café du Monde", license: "", url: "https://www.cafedumonde.com", venue:true },
  3:  { author: "Daniel Lobo", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Saint_Louis_Cemetery_1_-_Tombs,_July_2023.jpg" },
  4:  { author: "JennyCuervo", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mississippi_River_in_Louisiana._Steamboat_Natchez.jpg" },
  5:  { author: "Cory Doctorow", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Preservation_Hall,_French_Quarter,_New_Orleans,_Louisiana,_USA_January_2023.jpg" },
  6:  { author: "GW Fins", license: "", url: "https://www.gwfins.com", venue:true },
  7:  { author: "Bar Tonique", license: "", url: "https://www.bartonique.com", venue:true },
  8:  { author: "Carousel Bar & Lounge", license: "", url: "https://www.hotelmonteleone.com/entertainment/carousel-bar", venue:true },
  9:  { author: "MusikAnimal", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Royal_Street,_New_Orleans_from_Conti_Street_2.JPG" },
  10: { author: "Jewel of the South", license: "", url: "https://www.jewelnola.com", venue:true },
  11: { author: "Infrogmation of New Orleans", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Frenchmen_Street_New_Orleans_August_2018_1.jpg" },
  12: { author: "The Spotted Cat Music Club", license: "", url: "https://www.spottedcatmusicclub.com", venue:true },
  13: { author: "Bacchanal Wine", license: "", url: "https://www.bacchanalwine.com", venue:true },
  14: { author: "N7", license: "", url: "https://www.n7nola.com", venue:true },
  15: { author: "Hotel Peter & Paul", license: "", url: "https://www.hotelpeterandpaul.com", venue:true },
  16: { author: "Infrogmation of New Orleans", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Crescent_Park_Upper_Bridge_New_Orleans_02.jpg" },
  17: { author: "Satsuma Cafe", license: "", url: "https://www.satsumacafe.com", venue:true },
  18: { author: "Carol M. Highsmith", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Entrance_arch_to_Louis_Armstrong_Park_in_the_Treme_neighborhood_of_New_Orleans,_Louisiana_LCCN2011632995.tif" },
  19: { author: "Backstreet Cultural Museum", license: "", url: "https://www.backstreetmuseum.org", venue:true },
  20: { author: "Kermit's Tremé Mother-in-Law Lounge", license: "", url: "https://www.facebook.com/KermitsMotherInLawLounge", venue:true },
  21: { author: "TonyTheTiger", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:20080622_St._Charles_St._Trolley_behind_tree_with_Mardi_Gras_beads.JPG" },
  22: { author: "Commander's Palace", license: "", url: "https://www.commanderspalace.com", venue:true },
  23: { author: "MusikAnimal", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Tombs_at_Lafayette_Cemetery_No_1_Garden_District_New_Orleans.JPG" },
  24: { author: "Coquette", license: "", url: "https://www.coquettenola.com", venue:true },
  25: { author: "Nicolas Henderson", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:New_Orleans,_LA_April_2017_-_Commercial_buildings_on_Magazine_Street.jpg" },
  26: { author: "The Avenue Pub", license: "", url: "https://theavenuepub.com", venue:true },
  27: { author: "Tony Webster", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:The_National_World_War_II_Museum_(27748358075).jpg" },
  28: { author: "ajay_suresh", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Ogden_Museum_of_Southern_Art_(55151866298).jpg" },
  29: { author: "Cochon", license: "", url: "https://www.cochonrestaurant.com", venue:true },
  30: { author: "Maison de la Luz", license: "", url: "https://www.maisondeluz.com", venue:true },
  31: { author: "Willie Mae's NOLA", license: "", url: "https://www.williemaesnola.com", venue:true },
  32: { author: "ajay_suresh", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:The_Contemporary_Arts_Center,_New_Orleans_(55151866258).jpg" },
  33: { author: "Infrogmation of New Orleans", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:City_Park_New_Orleans_November_2017_04_NOMA_Front.jpg" },
  34: { author: "Infrogmation of New Orleans", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:View_from_Magnolia_Bridge,_Bayou_St._John,_New_Orleans_10_April_2016_03.jpg" },
  35: { author: "Café Degas", license: "", url: "https://www.cafedegas.com", venue:true },
  36: { author: "Angelo Brocato", license: "", url: "https://www.angelobrocatoicecream.com", venue:true },
  37: { author: "Parkway Bakery & Tavern", license: "", url: "https://www.parkwaybakeryandtavern.com", venue:true },
  38: { author: "Bart Everson", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Lafitte_Greenway,_New_Orleans_-_Blue_Bikes.jpg" },
  39: { author: "The Kingsway", license: "", url: "https://www.kingswaynola.com", venue:true },
  40: { author: "Infrogmation of New Orleans", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Noisewater_at_Tipitina's_-_Audience_on_the_Floor.jpg" },
  41: { author: "Brigtsen's", license: "", url: "https://www.brigtsens.com", venue:true },
  42: { author: "Clancy's", license: "", url: "https://www.clancysneworleans.com", venue:true },
  43: { author: "Camellia Grill", license: "", url: "https://www.camelliagrillnola.com", venue:true },
  44: { author: "Infrogmation of New Orleans", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Audubon_Park_New_Orleans_7_April_2020_-_09.jpg" },
  45: { author: "Barrel Proof", license: "", url: "https://www.barrelproofnola.com", venue:true },
  46: { author: "La Petite Grocery", license: "", url: "https://www.lapetitegrocery.com", venue:true },
  47: { author: "Cooter Brown's Tavern", license: "", url: "https://www.cooterbrowns.com", venue:true },
  48: { author: "Fives Oyster Bar", license: "", url: "https://www.fives.bar", venue:true },
  49: { author: "Jeremy Thompson", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:New_Orleans_Pharmacy_Museum,_November_2025_-_01.jpg" },
  50: { author: "Mardi Gras World", license: "", url: "https://www.mardigrasworld.com", venue:true },
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
