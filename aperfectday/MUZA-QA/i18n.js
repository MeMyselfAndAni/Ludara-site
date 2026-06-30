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
      splash_note:'Exhibition information current as of June 2026.',
      full_route:'🗺 Full Route', pdf_guide:'📄 PDF Guide', save_map:'🖼 Save Map',
      places_word_btn:'Places',
      no_saved_title:'No saved places yet',
      no_saved_body:'Tap ♡ on any pavilion to save it here — then plan your route, download a PDF, or save the map for offline use.',
      trip_highlights_name:'Museum Highlights', trip_highlights_note:'Start at the entrance, climb the tell, then the pavilions',
      trip_park_name:'Park & Heritage', trip_park_note:'A quieter loop through the western park',
      trip_loaded:'loaded', stops_word:'stops', undo:'Undo',
      our_picks_html:'Our<br>Picks', arc_highlights:'Highlights', arc_park:'Park',
      stop_one:'stop', min_walk:'min walk', min_drive:'min drive', min_here:'min here',
      mins_total:'total', walking_word:'walking', autosort:'↺ Auto-sort',
      walk_here:'🚶 Walk here (Google Maps)', clear_btn:'🗑 Clear',
      pdf_cover_sub:'Your personal day guide', pdf_curated_by:'Curated by', pdf_scan:'Scan for Google Maps',
      pdf_created_with:'Interactive map guide created with', pdf_preparing:'Preparing your guide…',
      pdf_walking:'Walking', pdf_driving:'Driving', pdf_travel_time:'Travel Time',
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
      splash_note:'מידע על התערוכות עדכני ליוני 2026.',
      full_route:'🗺 מסלול מלא', pdf_guide:'📄 מדריך PDF', save_map:'🖼 שמירת מפה',
      places_word_btn:'מקומות',
      no_saved_title:'אין עדיין מקומות שמורים',
      no_saved_body:'הקישו ♡ על כל ביתן כדי לשמור אותו כאן — ואז תכננו מסלול, הורידו PDF או שמרו את המפה לצפייה לא מקוונת.',
      trip_highlights_name:'עיקרי המוזיאון', trip_highlights_note:'התחילו בכניסה, עלו לתל, ואז הביתנים',
      trip_park_name:'פארק ומורשת', trip_park_note:'מסלול שקט יותר בפארק המערבי',
      trip_loaded:'נטען', stops_word:'עצירות', undo:'ביטול',
      our_picks_html:'הבחירות<br>שלנו', arc_highlights:'מומלצים', arc_park:'פארק',
      stop_one:'עצירה', min_walk:'דק׳ הליכה', min_drive:'דק׳ נסיעה', min_here:'דק׳ במקום',
      mins_total:'סה״כ', walking_word:'הליכה', autosort:'↺ מיון אוטומטי',
      walk_here:'🚶 נווטו לכאן (Google Maps)', clear_btn:'🗑 ניקוי',
      pdf_cover_sub:'מדריך אישי ליום שלם', pdf_curated_by:'נערך על ידי', pdf_scan:'סרקו ל‑Google Maps',
      pdf_created_with:'מדריך מפה אינטראקטיבית נוצר עם', pdf_preparing:'מכינים את המדריך…',
      pdf_walking:'הליכה', pdf_driving:'נסיעה', pdf_travel_time:'זמן נסיעה',
    }
  }
};

function t(key){
  const L = STRINGS[LANG] || STRINGS.en;
  return (L.ui && L.ui[key]) || STRINGS.en.ui[key] || key;
}

function getLang(){
  try { const s = localStorage.getItem('muza_lang'); if(s && langCodes().includes(s)) return s; } catch(e){}
  const nav = (navigator.language || '').toLowerCase();
  const hit = LANGS.find(l => nav.startsWith(l.code));   // browser language → matching guide language
  return hit ? hit.code : DEFAULT_LANG;
}

function applyStaticI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
}

// Drawn SVG flags (render everywhere, unlike emoji flags which show as "GB"/"IL" on Windows)
const FLAG_US = '<svg viewBox="0 0 30 20" width="20" height="13"><rect width="30" height="20" fill="#B22234"/><g fill="#fff"><rect y="1.54" width="30" height="1.54"/><rect y="4.62" width="30" height="1.54"/><rect y="7.69" width="30" height="1.54"/><rect y="10.77" width="30" height="1.54"/><rect y="13.85" width="30" height="1.54"/><rect y="16.92" width="30" height="1.54"/></g><rect width="12" height="10.77" fill="#3C3B6E"/><g fill="#fff"><circle cx="2" cy="2" r="0.7"/><circle cx="5" cy="2" r="0.7"/><circle cx="8" cy="2" r="0.7"/><circle cx="11" cy="2" r="0.7"/><circle cx="3.5" cy="4" r="0.7"/><circle cx="6.5" cy="4" r="0.7"/><circle cx="9.5" cy="4" r="0.7"/><circle cx="2" cy="6" r="0.7"/><circle cx="5" cy="6" r="0.7"/><circle cx="8" cy="6" r="0.7"/><circle cx="11" cy="6" r="0.7"/><circle cx="3.5" cy="8" r="0.7"/><circle cx="6.5" cy="8" r="0.7"/><circle cx="9.5" cy="8" r="0.7"/></g></svg>';
const FLAG_IL = '<svg viewBox="0 0 30 20" width="20" height="13"><rect width="30" height="20" fill="#fff"/><rect width="30" height="2.6" y="3" fill="#0038b8"/><rect width="30" height="2.6" y="14.4" fill="#0038b8"/><g fill="none" stroke="#0038b8" stroke-width="1.1"><path d="M15 7.1l2.7 4.7h-5.4z"/><path d="M15 12.9l2.7-4.7h-5.4z"/></g></svg>';
const FLAG_RU = '<svg viewBox="0 0 30 20" width="20" height="13"><rect width="30" height="20" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#0039A6"/><rect y="13.33" width="30" height="6.67" fill="#D52B1E"/></svg>';

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE REGISTRY — to add a language, add ONE entry here, add a STRINGS[code]
// block above, and (optionally) a per-place block in data.js (e.g. p.ru = {...}).
// Anything not translated falls back to English automatically, so a language can
// be added incrementally. `short` is the 2-letter badge on the toggle; `flag` is
// optional (pass null to show the name only — e.g. for Arabic, which has no single
// country flag); `rtl:true` makes that language right-to-left.
// ─────────────────────────────────────────────────────────────────────────────
const LANGS = [
  { code:'he', name:'עברית',   short:'עב', flag:FLAG_IL, rtl:true  },
  { code:'en', name:'English', short:'EN', flag:FLAG_US, rtl:false },
  // { code:'ru', name:'Русский', short:'RU', flag:FLAG_RU, rtl:false },   // + STRINGS.ru + p.ru
  // { code:'ar', name:'العربية', short:'ع',  flag:null,    rtl:true  },    // + STRINGS.ar + p.ar
];
const DEFAULT_LANG = 'he';
function langDef(code){ return LANGS.find(l => l.code === code) || LANGS.find(l => l.code === DEFAULT_LANG) || LANGS[0]; }
function langCodes(){ return LANGS.map(l => l.code); }

function updateLangToggle(){
  const d = langDef(LANG);
  const lbl = document.getElementById('lang-label');
  if(lbl){
    lbl.innerHTML = (d.flag ? d.flag + ' ' : '') + '<b>' + d.short + '</b> <span style="opacity:.7;font-size:0.72em">▾</span>';
  }
  const menu = document.getElementById('lang-menu');
  if(menu){
    menu.innerHTML = LANGS.map(function(l){
      return '<button type="button" class="lang-opt' + (l.code===LANG ? ' active' : '') +
        '" onclick="pickLang(\'' + l.code + '\')">' + (l.flag ? l.flag + ' ' : '') + '<span>' + l.name + '</span></button>';
    }).join('');
  }
}
function pickLang(code){ applyLang(code); var m = document.getElementById('lang-menu'); if(m) m.style.display = 'none'; }

function applyLang(lang){
  if(!langCodes().includes(lang)) lang = DEFAULT_LANG;
  LANG = lang;
  try { localStorage.setItem('muza_lang', lang); } catch(e){}

  const C  = STRINGS[lang] || STRINGS.en;   // missing language block → English
  const EN = STRINGS.en;

  // 1) remix every place's active fields (per-field fallback to English)
  if(typeof PLACES !== 'undefined' && Array.isArray(PLACES)){
    PLACES.forEach(p => {
      const L = p[lang] || {}, E = p.en || {};
      p.name    = L.name != null ? L.name : E.name;
      p.type    = L.role != null ? L.role : E.role;
      p.address = L.zone != null ? L.zone : E.zone;
      p.note    = L.desc != null ? L.desc : E.desc;
      p.tip     = L.tip  != null ? L.tip  : E.tip;
    });
  }
  // 2) relabel the (const) dictionaries by mutating their keys (fallback to English)
  function relabel(dict, key){ if(typeof dict === 'undefined') return; const src = (C[key] || EN[key] || {}); Object.keys(src).forEach(k => dict[k] = src[k]); }
  if(typeof CL          !== 'undefined') relabel(CL,          'cl');
  if(typeof CAT_LABELS  !== 'undefined') relabel(CAT_LABELS,  'catLabels');
  if(typeof NBHD_LABELS !== 'undefined') relabel(NBHD_LABELS, 'zones');

  // 3) direction — RTL languages right-align text containers; map chrome stays LTR via CSS
  const rtl = !!langDef(lang).rtl;
  document.documentElement.setAttribute('lang', lang);
  if(document.body) document.body.classList.toggle('rtl', rtl);

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

function toggleLang(){ var m = document.getElementById('lang-menu'); if(!m) return; m.style.display = (m.style.display === 'block') ? 'none' : 'block'; }

// Build the splash language buttons from the LANGS registry
function buildSplashLangButtons(){
  var row = document.getElementById('splash-lang-row');
  if(!row) return;
  row.innerHTML = LANGS.map(function(l){
    var cls = 'splash-btn' + (l.rtl ? '' : ' splash-btn-en');
    return '<button type="button" class="' + cls + '" onclick="splashPick(\'' + l.code + '\')">' +
      (l.flag ? l.flag + ' ' : '') + l.name + '</button>';
  }).join('');
}

// Splash step 1 → 2: pick a language, then show that language's intro, hours and Enter button
function splashPick(lang){
  applyLang(lang);
  var st = document.getElementById('splash-sub-text');
  var ht = document.getElementById('splash-hours-text');
  var eb = document.getElementById('splash-enter-btn');
  if(st) st.textContent = t('splash_welcome');
  if(ht) ht.textContent = t('splash_hours');
  if(eb) eb.textContent = t('splash_enter');
  var nt = document.getElementById('splash-note-text');
  if(nt) nt.textContent = t('splash_note');
  var info = document.getElementById('splash-info');
  if(info) info.setAttribute('dir', langDef(lang).rtl ? 'rtl' : 'ltr');
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
document.addEventListener('DOMContentLoaded', function(){
  buildSplashLangButtons();
  applyLang(getLang());
});
// Close the language menu when clicking outside it
document.addEventListener('click', function(e){
  var m = document.getElementById('lang-menu'), f = document.getElementById('lang-fixed');
  if(m && m.style.display === 'block' && f && !f.contains(e.target) && !m.contains(e.target)) m.style.display = 'none';
});
