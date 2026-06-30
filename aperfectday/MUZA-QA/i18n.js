// A Perfect Day — MUZA · bilingual engine (HE / EN)
// One global LANG. applyLang() copies the active language into every place's
// active fields (name/type/note/tip/address), relabels the category/zone
// dictionaries, swaps the static chrome via [data-i18n], and re-renders.
// Markers are emoji-only, so they never need relabelling.

let LANG = 'he';

const STRINGS = {
  en: {
    cl:        { pavilion:'Pavilions', hall:'Exhibition Halls', heritage:'Heritage', outdoor:'Gardens & Outdoor', service:'Services' },
    catLabels: { pavilion:'Pavilion', hall:'Exhibition Hall', heritage:'Heritage Site', outdoor:'Garden & Outdoor', service:'Service' },
    zones:     { east:'Eastern Pavilions', core:'Central Core', park:'Western Park' },
    ui: {
      hdr_apd_in:'A Perfect Day in', hdr_museum:'Eretz Israel Museum',
      hdr_sub:'Pavilions & current exhibitions · מוז״א',
      hdr_guide_h1:'<em>Eretz Israel Museum</em> Guide',
      credit:'Interactive map by Ludara.AI ↗',
      f_saved:'Saved', f_all:'All', f_pavilion:'Pavilions', f_hall:'Exhibition Halls',
      f_heritage:'Heritage', f_outdoor:'Gardens & Outdoor', f_service:'Services',
      zones_title:'Campus zones', z_all:'All', z_east:'Eastern Pavilions', z_core:'Central Core', z_park:'Western Park',
      places:'Places', places_word:'Places', guide:'Guide',
      trip_title:'🗺 Your Saved Places Route', trip_maps:'🗺 Open in Google Maps',
      trip_pdf:'⬇ Download PDF Guide', trip_share:'🔗 Share',
      saved_panel:'Your Saved Places', footer_by:'Interactive map by',
      tip_label:'💡 Tip', website:'🌐 Website',
      search_ph:'Search places…', match_one:'match', match_many:'matches', saved_word:'Saved',
      drag_reorder:'Drag ⠿ to reorder stops', itinerary:'🗺 Itinerary', auto:'↺ Auto',
      empty_saved:'Tap ♡ on any place<br>to save it here',
      saved_cleared:'Saved places cleared.', on_map:'on map',
      splash_welcome:"Welcome to MUZA, the Eretz Israel Museum — pavilions of ceramics, glass, coins, copper and folklore around a 3,000-year-old tell and green gardens. This guide helps you find each one and see what's on show inside it now.",
      splash_hours:'🕐 Opening hours · Sun–Wed 10:00–16:00 · Thu 10:00–20:00 · Fri & Sat 10:00–14:00',
      splash_enter:'Enter the Museum Map',
    }
  },
  he: {
    cl:        { pavilion:'ביתנים', hall:'אולמות תערוכה', heritage:'מורשת', outdoor:'גנים ומרחב פתוח', service:'שירותים למבקרים' },
    catLabels: { pavilion:'ביתן', hall:'אולם תערוכה', heritage:'אתר מורשת', outdoor:'גן ומרחב פתוח', service:'שירות למבקרים' },
    zones:     { east:'הביתנים המזרחיים', core:'מתחם המרכז', park:'הפארק המערבי' },
    ui: {
      hdr_apd_in:'A Perfect Day —', hdr_museum:'מוזיאון ארץ ישראל',
      hdr_sub:'ביתנים ותערוכות מתחלפות · מוז״א',
      hdr_guide_h1:'מדריך <em>מוזיאון ארץ ישראל</em>',
      credit:'מפה אינטראקטיבית מאת Ludara.AI ↗',
      f_saved:'שמורים', f_all:'הכול', f_pavilion:'ביתנים', f_hall:'אולמות תערוכה',
      f_heritage:'מורשת', f_outdoor:'גנים ומרחב פתוח', f_service:'שירותים למבקרים',
      zones_title:'אזורי המתחם', z_all:'הכול', z_east:'הביתנים המזרחיים', z_core:'מתחם המרכז', z_park:'הפארק המערבי',
      places:'מקומות', places_word:'מקומות', guide:'מדריך',
      trip_title:'🗺 מסלול המקומות השמורים', trip_maps:'🗺 פתחו ב‑Google Maps',
      trip_pdf:'⬇ הורדת מדריך PDF', trip_share:'🔗 שיתוף',
      saved_panel:'המקומות השמורים שלי', footer_by:'מפה אינטראקטיבית מאת',
      tip_label:'💡 המלצה', website:'🌐 אתר',
      search_ph:'חיפוש מקומות…', match_one:'תוצאה', match_many:'תוצאות', saved_word:'שמורים',
      drag_reorder:'גררו לשינוי סדר', itinerary:'🗺 מסלול', auto:'↺ אוטומטי',
      empty_saved:'הקישו ♡ על כל מקום<br>כדי לשמור אותו כאן',
      saved_cleared:'המקומות השמורים נמחקו.', on_map:'במפה',
      splash_welcome:'ברוכים הבאים למוז״א, מוזיאון ארץ ישראל — ביתני קרמיקה, זכוכית, מטבעות, נחושת ופולקלור סביב תל בן 3,000 שנה וגנים ירוקים. המדריך יעזור לכם למצוא כל ביתן ולראות מה מוצג בו עכשיו.',
      splash_hours:'🕐 שעות פתיחה · א׳–ד׳ 10:00–16:00 · ה׳ 10:00–20:00 · ו׳–שבת 10:00–14:00',
      splash_enter:'כניסה למפת המוזיאון',
    }
  }
};

function t(key){
  const L = STRINGS[LANG] || STRINGS.en;
  return (L.ui && L.ui[key]) || STRINGS.en.ui[key] || key;
}

function getLang(){
  try { const s = localStorage.getItem('muza_lang'); if(s==='he'||s==='en') return s; } catch(e){}
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'he';   // English browsers → EN, everyone else → Hebrew
}

function applyStaticI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
}

// Drawn SVG flags (render everywhere, unlike emoji flags which show as "GB"/"IL" on Windows)
const FLAG_GB = '<svg viewBox="0 0 30 20" width="20" height="13"><rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" stroke-width="2"/><rect x="12.5" width="5" height="20" fill="#fff"/><rect y="7.5" width="30" height="5" fill="#fff"/><rect x="13.5" width="3" height="20" fill="#C8102E"/><rect y="8.5" width="30" height="3" fill="#C8102E"/></svg>';
const FLAG_IL = '<svg viewBox="0 0 30 20" width="20" height="13"><rect width="30" height="20" fill="#fff"/><rect width="30" height="2.6" y="3" fill="#0038b8"/><rect width="30" height="2.6" y="14.4" fill="#0038b8"/><g fill="none" stroke="#0038b8" stroke-width="1.1"><path d="M15 7.1l2.7 4.7h-5.4z"/><path d="M15 12.9l2.7-4.7h-5.4z"/></g></svg>';

function updateLangToggle(){
  const lbl = document.getElementById('lang-label');
  if(!lbl) return;
  lbl.innerHTML = (LANG==='he')
    ? FLAG_GB + ' EN&nbsp;·&nbsp;<b>' + FLAG_IL + ' עב</b>'
    : '<b>' + FLAG_GB + ' EN</b>&nbsp;·&nbsp;' + FLAG_IL + ' עב';
}

function applyLang(lang){
  if(lang!=='he' && lang!=='en') lang = 'he';
  LANG = lang;
  try { localStorage.setItem('muza_lang', lang); } catch(e){}

  const C = STRINGS[lang];

  // 1) remix every place's active fields
  if(typeof PLACES !== 'undefined' && Array.isArray(PLACES)){
    PLACES.forEach(p => {
      const L = p[lang] || p.en || {};
      p.name = L.name; p.type = L.role; p.address = L.zone; p.note = L.desc; p.tip = L.tip;
    });
  }
  // 2) relabel the (const) dictionaries by mutating their keys
  if(typeof CL !== 'undefined')          Object.keys(C.cl).forEach(k => CL[k] = C.cl[k]);
  if(typeof CAT_LABELS !== 'undefined')  Object.keys(C.catLabels).forEach(k => CAT_LABELS[k] = C.catLabels[k]);
  if(typeof NBHD_LABELS !== 'undefined') Object.keys(C.zones).forEach(k => NBHD_LABELS[k] = C.zones[k]);

  // 3) direction (text containers only — map chrome stays LTR via CSS)
  document.documentElement.setAttribute('lang', lang);
  if(document.body) document.body.classList.toggle('lang-he', lang==='he');

  // 4) static chrome + toggle button
  applyStaticI18n();
  updateLangToggle();

  // 5) re-render dynamic UI
  if(typeof setBasemapLang === 'function') setBasemapLang(lang);
  if(typeof renderList === 'function') renderList();
  if(typeof CARD_PLACE !== 'undefined' && CARD_PLACE && typeof _populateCard === 'function') _populateCard(CARD_PLACE);
  if(typeof refreshSavedPill === 'function') refreshSavedPill();
  const si = document.getElementById('search-input'); if(si) si.placeholder = t('search_ph');
}

function toggleLang(){ applyLang(LANG === 'he' ? 'en' : 'he'); }

// Splash step 1 → 2: pick a language, then show that language's intro, hours and Enter button
function splashPick(lang){
  applyLang(lang);
  var st = document.getElementById('splash-sub-text');
  var ht = document.getElementById('splash-hours-text');
  var eb = document.getElementById('splash-enter-btn');
  if(st) st.textContent = t('splash_welcome');
  if(ht) ht.textContent = t('splash_hours');
  if(eb) eb.textContent = t('splash_enter');
  var info = document.getElementById('splash-info');
  if(info) info.setAttribute('dir', lang==='he' ? 'rtl' : 'ltr');
  var choose = document.getElementById('splash-choose');
  if(choose) choose.style.display = 'none';
  if(info) info.style.display = '';
}
function splashReset(){
  var info = document.getElementById('splash-info');
  var choose = document.getElementById('splash-choose');
  if(info) info.style.display = 'none';
  if(choose) choose.style.display = '';
}
// kept for safety if referenced elsewhere
function enterIn(lang){ splashPick(lang); }

// Localise the chrome as early as possible (before the map finishes loading)
document.addEventListener('DOMContentLoaded', function(){ applyLang(getLang()); });
