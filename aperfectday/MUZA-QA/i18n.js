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
    }
  },
  he: {
    cl:        { pavilion:'ביתנים', hall:'אולמות תערוכה', heritage:'מורשת', outdoor:'גנים ומרחב פתוח', service:'שירותים' },
    catLabels: { pavilion:'ביתן', hall:'אולם תערוכה', heritage:'אתר מורשת', outdoor:'גן ומרחב פתוח', service:'שירות' },
    zones:     { east:'הביתנים המזרחיים', core:'מתחם המרכז', park:'הפארק המערבי' },
    ui: {
      hdr_apd_in:'A Perfect Day —', hdr_museum:'מוזיאון ארץ ישראל',
      hdr_sub:'ביתנים ותערוכות מתחלפות · מוז״א',
      hdr_guide_h1:'מדריך <em>מוזיאון ארץ ישראל</em>',
      credit:'מפה אינטראקטיבית מאת Ludara.AI ↗',
      f_saved:'שמורים', f_all:'הכול', f_pavilion:'ביתנים', f_hall:'אולמות תערוכה',
      f_heritage:'מורשת', f_outdoor:'גנים ומרחב פתוח', f_service:'שירותים',
      zones_title:'אזורי המתחם', z_all:'הכול', z_east:'הביתנים המזרחיים', z_core:'מתחם המרכז', z_park:'הפארק המערבי',
      places:'מקומות', places_word:'מקומות', guide:'מדריך',
      trip_title:'🗺 מסלול המקומות השמורים', trip_maps:'🗺 פתחו ב‑Google Maps',
      trip_pdf:'⬇ הורדת מדריך PDF', trip_share:'🔗 שיתוף',
      saved_panel:'המקומות השמורים שלי', footer_by:'מפה אינטראקטיבית מאת',
      tip_label:'💡 טיפ', website:'🌐 אתר',
      search_ph:'חיפוש מקומות…', match_one:'תוצאה', match_many:'תוצאות', saved_word:'שמורים',
      drag_reorder:'גררו ⠿ לשינוי סדר העצירות', itinerary:'🗺 מסלול', auto:'↺ אוטומטי',
      empty_saved:'הקישו ♡ על כל מקום<br>כדי לשמור אותו כאן',
      saved_cleared:'המקומות השמורים נמחקו.', on_map:'במפה',
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

function updateLangToggle(){
  const lbl = document.getElementById('lang-label');
  if(lbl){
    lbl.innerHTML = (LANG==='he')
      ? '🌐 EN · <b>עב</b>'
      : '🌐 <b>EN</b> · עב';
  }
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

// Splash language chooser: set the language, then enter the map
function enterIn(lang){
  applyLang(lang);
  if(typeof closeSplash === 'function') closeSplash();
}

// Localise the chrome as early as possible (before the map finishes loading)
document.addEventListener('DOMContentLoaded', function(){ applyLang(getLang()); });
