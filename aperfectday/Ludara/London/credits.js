// ── Photo attribution per place id (London) ──
// Two kinds of entry:
//   CC images  : author = photographer, license = CC license, url = Wikimedia Commons file page.
//   venue:true : the venue's own website photo, credited to the venue, url = their site (no CC license).
// Places with no entry here show no credit line.
const PHOTO_CREDITS = {
  // ── Creative Commons landmark images ──
  3:   { author: "Pouazity3", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Churchill-War-Rooms-London_Telephone_Room.jpg", venue:false },
  7:   { author: "chris.rycroft", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Turbine_hall_at_the_Tate_Modern_art_gallery.jpg", venue:false },
  8:   { author: "Acabashi", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Shakespeare%27s_Globe_at_night_from_Bankside_path,_Southwark_London_England.jpg", venue:false },
  9:   { author: "Alexander-93", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:05_2023_London_Millennium_Bridge_with_St_Paul%27s_IMG_7483.jpg", venue:false },
  11:  { author: "Christine Matthews", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Fruit_and_Vegetable_Stall,_Borough_Market,_London_SE1_-_geograph.org.uk_-_4725648.jpg", venue:false },
  19:  { author: "White Cube (photo: Ben Westoby)", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:White_Cube_Bermondsey_Photo_by_Ben_Westoby.jpg", venue:false },
  23:  { author: "Diliff", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Tower_Bridge_London_Dusk_Feb_2006.jpg", venue:false },
  24:  { author: "Bob Collowan", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Tower_of_London_viewed_from_the_River_Thames.jpg", venue:false },
  26:  { author: "Diliff", license: "CC BY 2.5", url: "https://commons.wikimedia.org/wiki/File:Leadenhall_Market_In_London_-_Feb_2006_rotated.jpg", venue:false },
  28:  { author: "Diliff", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:St_Paul%27s_Cathedral,_London,_England_-_Jan_2010.jpg", venue:false },
  29:  { author: "mattbuck", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:London_MMB_N2_Covent_Garden.jpg", venue:false },
  30:  { author: "Bryn Holmes", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Neal%27s_Yard,_Covent_Garden_-_geograph.org.uk_-_7395246.jpg", venue:false },
  35:  { author: "Jim Linwood", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Ronnie_Scott%27s_Jazz_Club,_47_Frith_Street,_Soho_-_London.jpg", venue:false },
  40:  { author: "Wellcome Collection", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:The_Wellcome_Building,_Euston_Road,_London;_Wellcome_L0034641.jpg", venue:false },
  43:  { author: "Cristian Bortes", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Portobello_Market_-_Notting_Hill_(2946923757).jpg", venue:false },
  47:  { author: "Ewan Munro", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Electric_Cinema_Notting_Hill_2009.jpg", venue:false },
  49:  { author: "David Castor", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Victoria_and_Albert_Museum-1.jpg", venue:false },
  59:  { author: "Bex Walton", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Daunt_Books,_Marylebone_2026-02-07.jpg", venue:false },
  62:  { author: "Julian Herzog", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Barbican_Estate_Lakeside_City_of_London_2026_10.jpg", venue:false },
  63:  { author: "Maggie Jones", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Dennis_Severs_house.jpg", venue:false },
  67:  { author: "Acabashi", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:King%27s_Cross_Central_development_Coal_Drops_Yard,_London,_England.jpg", venue:false },
  76:  { author: "Anthony O'Neil", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Room_7_in_the_Saatchi_Gallery,_London_-_geograph.org.uk_-_2281247.jpg", venue:false },
  77:  { author: "Fred Romero", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:London_-_Serpentine_Sackler_Gallery.jpg", venue:false },
  78:  { author: "R4vi", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Newport_Street_Gallery,_London.jpg", venue:false },
  80:  { author: "Robert Lamb", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:View_of_Liberty_from_Great_Marlborough_Street_-_geograph.org.uk_-_6095126.jpg", venue:false },
  81:  { author: "Bex Walton", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Bermondsey_Square_Antiques_Market_2026-05-08.jpg", venue:false },
  82:  { author: "Eusebius", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Victoria_and_Kensington_Palace.jpg", venue:false },
  83:  { author: "Kwh1050", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Fortnum_and_Mason_Piccadilly_Exterior_Nov_2020.jpg", venue:false },
  84:  { author: "The Ritz London", license: "", url: "https://www.theritzlondon.com", venue:true },
  88:  { author: "It's No Game", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Abbey_Road_zebra_crossing_(uploaded_on_2021-02-28_by_It%27s_No_Game).jpg", venue:false },
  89:  { author: "Roy Katzenberg", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:The_100_Club_Oxford_Street,_London_2023-04-26.jpg", venue:false },
  90:  { author: "Diliff", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Royal_Albert_Hall,_London_-_Nov_2012.jpg", venue:false },
  91:  { author: "No Swan So Fine", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:6_Denmark_Street,_St_Giles,_April_2023.jpg", venue:false },
  92:  { author: "Ewan Munro", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:KOKO,_Camden_Town,_NW1_(2570837815).jpg", venue:false },
  93:  { author: "Anthony O'Neil", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Auditorium_-_Wigmore_Hall_-_geograph.org.uk_-_3763920.jpg", venue:false },
  95:  { author: "Tohma", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Globe_Theatre_Innenraum.jpg", venue:false },
  96:  { author: "Derbrauni", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:British_Library_01.jpg", venue:false },
  97:  { author: "Ewan Munro", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Ye_Olde_Cheshire_Cheese,_Fleet_Street,_EC4_(8032557646).jpg", venue:false },
  98:  { author: "Spudgun67", license: "CC0 (Public Domain)", url: "https://commons.wikimedia.org/wiki/File:12_Gough_Square_London_EC4A_3DW_and_Dr_Johnsons_House_17_Gough_Square_London_EC4A_3DE.jpg", venue:false },
  99:  { author: "Bex Walton", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Daunt_Books,_Marylebone_2026-02-07.jpg", venue:false },
  100: { author: "Thomas Quine", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Antique_piano_at_Keats_House.jpg", venue:false },
  101: { author: "Diliff", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Kew_Gardens_Palm_House,_London_-_July_2009.jpg", venue:false },
  102: { author: "Daderot", license: "CC0 (Public Domain)", url: "https://commons.wikimedia.org/wiki/File:Walkway_-_Chelsea_Physic_Garden_-_DSC02735.jpg", venue:false },
  103: { author: "Ethan Doyle White", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:View_from_Parliament_Hill,_Hampstead_Heath_(01).jpg", venue:false },
  104: { author: "Colin", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:St_James%27s_Park_Lake_%E2%80%93_East_from_the_Blue_Bridge_-_2012-10-06.jpg", venue:false },
  105: { author: "Julian Herzog", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Red_Deer_Cervus_Elaphus_in_Richmond_Park_2024_02.jpg", venue:false },
  106: { author: "Colin", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:The_Sky_Garden.jpg", venue:false },

  // ── Venue-owned photos (their own website image + credit link) ──
  1:   { author: "Berry Bros. & Rudd", license: "", url: "https://www.bbr.com", venue:true },
  22:  { author: "The Garrison", license: "", url: "https://thegarrison.co.uk", venue:true },
  27:  { author: "Duck & Waffle", license: "", url: "https://duckandwaffle.com", venue:true },
  31:  { author: "Clos Maggiore", license: "", url: "https://www.closmaggiore.com", venue:true },
  32:  { author: "Barrafina", license: "", url: "https://barrafina.co.uk", venue:true },
  33:  { author: "Mr Fogg's", license: "", url: "https://mr-foggs.com/gin-parlour", venue:true },
  37:  { author: "Opium", license: "", url: "https://www.opiumchinatown.com", venue:true },
  38:  { author: "Bob Bob Ricard", license: "", url: "https://bobbobricard.com", venue:true },
  44:  { author: "Core by Clare Smyth", license: "", url: "https://corebyclaresmyth.com", venue:true },
  52:  { author: "The Harwood Arms", license: "", url: "https://www.harwoodarms.com", venue:true },
  60:  { author: "St. JOHN", license: "", url: "https://stjohnrestaurant.com", venue:true },
  68:  { author: "The French House", license: "", url: "https://frenchhousesoho.com", venue:true },
  69:  { author: "The Palomar", license: "", url: "https://www.thepalomar.co.uk", venue:true },
  72:  { author: "Rules", license: "", url: "https://rules.co.uk", venue:true },
  73:  { author: "The Connaught", license: "", url: "https://www.the-connaught.co.uk/bars-restaurant/the-connaught-bar/", venue:true },
  74:  { author: "Dukes London", license: "", url: "https://www.dukeshotel.com/dukes-bar", venue:true },
  75:  { author: "The Savoy", license: "", url: "https://www.thesavoylondon.com/restaurant/american-bar/", venue:true },
  79:  { author: "Dover Street Market", license: "", url: "https://london.doverstreetmarket.com", venue:true },
  85:  { author: "Claridge's", license: "", url: "https://www.claridges.co.uk", venue:true },
  86:  { author: "Floris London", license: "", url: "https://www.florislondon.com", venue:true },
  87:  { author: "Lock & Co.", license: "", url: "https://www.lockhatters.co.uk", venue:true },
  94:  { author: "Roundhouse", license: "", url: "https://www.roundhouse.org.uk", venue:true },
};

// Build the credit anchor HTML for a place id (returns '' if none).
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var label = 'Photo: ' + c.author + (c.license ? ' — ' + c.license : '');
  var href  = c.url || '#';
  return '<a href="' + href + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
