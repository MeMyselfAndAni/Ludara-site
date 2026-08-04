// familystorymap / BarOrFamily / credits.js
//
// One credit per image, the same shape the other family map uses.
//
// Most photographs here are scans from the family's own copy of
// "תינוקת בשמיכת פוך" (Zehava Bar-Or, 06.2018), used with the family's
// permission. Places with no family photograph may carry a freely licensed
// image from Wikimedia Commons instead, and each one is credited below with its
// photographer, its licence and a link to its file page.
//
// A place with neither shows its emoji, and that is by design: not every place
// in this story has a surviving picture.
//
// If an image file is not present in images/, its credit here is simply never
// drawn, because ui-card.js clears the credit line when a photograph fails to
// load. So an entry can safely be added before the file is.

const FAMILY_ARCHIVE = 'ארכיון המשפחה';

const PHOTO_CREDITS = {
  // ── Family archive, scanned from the book ────────────────────────────────
  1:  { author: FAMILY_ARCHIVE },   // וולברום
  4:  { author: FAMILY_ARCHIVE },   // קרקוב
  6:  { author: FAMILY_ARCHIVE },   // מחנה פייסקרצ׳אם
  8:  { author: FAMILY_ARCHIVE },   // הרי אורל וערבות סיביר
  9:  { author: FAMILY_ARCHIVE },   // טשקנט
  10: { author: FAMILY_ARCHIVE },   // הכפר שליד טשקנט
  13: { author: FAMILY_ARCHIVE },   // הופגייסמר
  15: { author: FAMILY_ARCHIVE },   // מרסיי
  16: { author: FAMILY_ARCHIVE },   // נמל חיפה
  18: { author: FAMILY_ARCHIVE },   // קריית מוצקין
  21: { author: FAMILY_ARCHIVE },   // בית עלמין צור שלום
  23: { author: FAMILY_ARCHIVE },   // אושוויץ־בירקנאו
  32: { author: FAMILY_ARCHIVE },   // בקעת הקהילות, יד ושם

  // ── Wikimedia Commons ────────────────────────────────────────────────────
  //    Every licence below was read off the file's own page, not inferred.
  //    Drop the matching images/place-N.jpg in to switch each of these on.

  3:  { author:  'צלם לא ידוע',
        prefix:  'סוסנוביץ, 1939',
        license: 'נחלת הכלל',
        url:     'https://commons.wikimedia.org/wiki/File:Public_execution_of_Poles,_Sosnowiec_city,_German-occupied_Poland,_1939.jpg' },

  5:  { author:  'צלם לא ידוע',
        prefix:  'בית הרים בזקופנה, 1937 עד 1939',
        license: 'נחלת הכלל',
        url:     'https://commons.wikimedia.org/wiki/File:Zakopane_-_chata_goralska._1937-1939_(74197676).jpg' },

  7:  { author:  'אלעזר לנגמן',
        prefix:  'מכרה פחם בדונבס, 1938',
        license: 'נחלת הכלל',
        url:     'https://commons.wikimedia.org/wiki/File:%D0%A8%D0%B0%D1%85%D1%82%D0%B0_%D0%B8%D0%BC._%D0%A1%D1%82%D0%B0%D0%BB%D0%B8%D0%BD%D0%B0.jpg' },

  17: { author:  'בנו רותנברג',
        prefix:  'מעברת עולים, אפריל 1951',
        license: 'CC BY 4.0',
        url:     'https://commons.wikimedia.org/wiki/File:Aliyah_(997008136550805171).jpg' },

  24: { author:  'Zala',
        prefix:  'שרידי מחנה פלשוב היום',
        license: 'CC BY-SA 4.0',
        url:     'https://commons.wikimedia.org/wiki/File:Krak%C3%B3w_dawny_ob%C3%B3z_koncentracyjny_KL_Plaszow_08.jpg' },

  // ── Awaiting the family's choice ─────────────────────────────────────────
  //    For these five the family is choosing between a photograph from the war
  //    and the site as it is today. Uncomment the one they pick, delete the
  //    other. See the choice sheet sent to them on 3 August 2026.

  // 25 ורשה
  // 25: { author:'צלם לא ידוע, מתוך דוח שטרופ', prefix:'גטו ורשה, אפריל עד מאי 1943', license:'נחלת הכלל',
  //       url:'https://commons.wikimedia.org/wiki/File:Stroop_Report_-_Warsaw_Ghetto_Uprising_03.jpg' },
  // 25: { author:'Adrian Grycuk', prefix:'אנדרטת מורדי הגטו בוורשה, 2019', license:'CC BY-SA 3.0 pl',
  //       url:'https://commons.wikimedia.org/wiki/File:Pomnik_Bohater%C3%B3w_Getta_w_Warszawie_2019.jpg' },

  // 26 טרבלינקה
  // 26: { author:'פרנצישק זומבצקי', prefix:'טרבלינקה, 1943', license:'נחלת הכלל',
  //       url:'https://commons.wikimedia.org/wiki/File:Treblinka_uprising_(Z%C4%85becki_1943).jpg' },
  // 26: { author:'Adrian Grycuk', prefix:'אתר ההנצחה בטרבלינקה היום', license:'CC BY-SA 3.0 pl',
  //       url:'https://commons.wikimedia.org/wiki/File:Treblinka_Cremation_Pit_2.jpg' },

  // 27 מיידאנק
  // 27: { author:'צלם לא ידוע, תצלום סיור אווירי', prefix:'מיידאנק, 24 ביוני 1944', license:'נחלת הכלל',
  //       url:'https://commons.wikimedia.org/wiki/File:Majdanek_(June_24,_1944).jpg' },
  // 27: { author:'Alians PL', prefix:'מוזיאון מיידאנק היום', license:'CC BY-SA 3.0 pl',
  //       url:'https://commons.wikimedia.org/wiki/File:Alians_PL,PanoramicViewsOfKLMajdanek,2012-09-09,PanoramaOf7Photos.jpg' },

  // 28 טרזינשטאט
  // 28: { author:'אלפרד קנטור', prefix:'מסמך מגטו טרזינשטאט, 1943', license:'נחלת הכלל',
  //       url:'https://commons.wikimedia.org/wiki/File:Alfred_Kantor_Ghetto_Theresienstadt_Best%C3%A4tigung_1943.jpg' },
  // 28: { author:'Petr1888', prefix:'המצודה הקטנה והבית עלמין הלאומי בטרזין היום', license:'CC BY-SA 3.0',
  //       url:'https://commons.wikimedia.org/wiki/File:Terez%C3%ADn_-_Mal%C3%A1_pevnost_a_N%C3%A1rodn%C3%AD_h%C5%99bitov1.JPG' },

  // 29 דכאו
  // 29: { author:'צלם לא ידוע', prefix:'דכאו, אפריל 1945', license:'נחלת הכלל',
  //       url:'https://commons.wikimedia.org/wiki/File:Dachau_watchtower_b_1945-04.jpg' },
  // 29: { author:'Kim Traynor', prefix:'אתר ההנצחה בדכאו', license:'CC BY-SA 4.0',
  //       url:'https://commons.wikimedia.org/wiki/File:Dachau_Memorial_(iron_sculpture).JPG' },

  // 2 הנחל שבפאתי וולברום. אין תצלום של הנחל עצמו, זהו רחוב בוולברום היום.
  // 2:  { author:'Kamil Czaiński', prefix:'וולברום היום', license:'CC BY-SA 4.0',
  //       url:'https://commons.wikimedia.org/wiki/File:Wolbrom,_ulica_Krakowska_-_komisariat_policji.jpg' },
};

// Build the credit HTML for a place id (returns '' if none).
// This function was missing from this map altogether, so no credit was drawn for
// any image at all, not even for the family archive scans.
function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c || !c.author) return '';
  var _pick = (typeof pickLang === 'function') ? pickLang : function(t){ return t; };
  var prefix = c.prefix ? _pick(c.prefix)
             : (typeof L3 === 'function' ? L3('צילום', 'Фото', 'Photo') : 'צילום');
  var label  = prefix + ': ' + _pick(c.author) + (c.license ? ', ' + _pick(c.license) : '');
  if(!c.url) return '<span class="pc-credit-text">' + label + '</span>';
  return '<a href="' + c.url + '" target="_blank" rel="noopener nofollow">' + label + '</a>';
}
