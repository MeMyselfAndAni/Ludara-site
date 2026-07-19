// A Perfect Day — Winterthur · i18n engine (English demo build)
// The engine stays multilingual-ready: to add a language later, add ONE entry to
// LANGS, a STRINGS[code] block below, and (optionally) per-place blocks in data.js
// (e.g. p.de = {...}). Anything not translated falls back to English automatically.

let LANG = 'en';

const STRINGS = {
  en: {
    cl:        { pavilion:'House & Galleries', hall:'Family', heritage:'Tram Tour', outdoor:'Gardens', service:'Eat & Shop' },
    catLabels: { pavilion:'House & Galleries', hall:'Family', heritage:'Tram Tour', outdoor:'Garden', service:'Visitor Services' },
    zones:     { core:'Museum & House', east:'The Garden', park:'Visitor Center' },
    ui: {
      hdr_apd_in:'A Perfect Day at', hdr_museum:'Winterthur',
      hdr_sub:'Museum, Garden & Library',
      hdr_guide_h1:'<em>Winterthur</em> Visitor Guide',
      credit:'Interactive map by Ludara.AI ↗',
      f_saved:'Saved', f_all:'All', f_pavilion:'House & Galleries', f_hall:'Family',
      f_heritage:'Tram Tour', f_outdoor:'Gardens', f_service:'Eat & Shop',
      zones_title:'Estate areas', z_all:'All', z_east:'The Garden', z_core:'Museum & House', z_park:'Visitor Center',
      places:'Places', places_word:'Places', guide:'Guide',
      trip_title:'🗺 Your Saved Places Route', trip_maps:'🗺 Open in Google Maps',
      trip_pdf:'⬇ Download PDF Guide', trip_share:'🔗 Share',
      saved_panel:'Your Saved Places', footer_by:'Interactive map by',
      tip_label:'💡 Tip', website:'🌐 Website',
      search_ph:'Search places…', match_one:'match', match_many:'matches', saved_word:'Saved',
      drag_reorder:'Drag ⠿ to reorder stops', itinerary:'🗺 Itinerary', auto:'↺ Auto',
      empty_saved:'Tap ♡ on any place<br>to save it here',
      saved_cleared:'Saved places cleared.', on_map:'on map',
      splash_welcome:"Welcome to Winterthur — Henry Francis du Pont's country estate, where a naturalistic 60-acre garden, a house filled with American decorative arts, and children's Enchanted Woods spread across a thousand acres. This guide helps you find each garden, gallery and trail, and plan your own day across the estate.",
      splash_hours:'🕐 Open Tuesday–Sunday · 10:00 am–5:00 pm · Garden, house & galleries',
      splash_enter:'Enter the Estate Map',
      splash_note:'A demo guide built from winterthur.org · July 2026.',
      full_route:'🗺 Full Route', pdf_guide:'📄 PDF Guide', save_map:'🖼 Save Map',
      places_word_btn:'Places',
      no_saved_title:'No saved places yet',
      no_saved_body:'Tap ♡ on any place to save it here — then plan your route, download a PDF, or save the map for offline use.',
      trip_twohour_name:'Two-Hour Visit', trip_twohour_note:'Garden tram tour, the March Bank, then the house',
      trip_fourhour_name:'Four-Hour Visit', trip_fourhour_note:'Galleries, the tureens, tram tour and the gardens',
      trip_family_name:'Family Visit', trip_family_note:'Enchanted Woods, the tram and the Reflecting Pool',
      trip_loaded:'loaded', stops_word:'stops', undo:'Undo',
      our_picks_html:'Day<br>Trips', arc_two:'2 Hours', arc_four:'4 Hours', arc_family:'Family',
      stop_one:'stop', min_walk:'min walk', min_drive:'min drive', min_here:'min here',
      mins_total:'total', walking_word:'walking', autosort:'↺ Auto-sort',
      walk_here:'🚶 Walk here (Google Maps)', clear_btn:'🗑 Clear',
      pdf_cover_sub:'Your personal day guide', pdf_curated_by:'Curated by', pdf_scan:'Scan for Google Maps',
      pdf_created_with:'Interactive map guide created with', pdf_preparing:'Preparing your guide…',
      pdf_walking:'Walking', pdf_driving:'Driving', pdf_travel_time:'Travel Time',
    }
  }
};

function t(key){
  const L = STRINGS[LANG] || STRINGS.en;
  return (L.ui && L.ui[key]) || STRINGS.en.ui[key] || key;
}

function getLang(){
  try { const s = localStorage.getItem('wt_lang'); if(s && langCodes().includes(s)) return s; } catch(e){}
  const nav = (navigator.language || '').toLowerCase();
  const hit = LANGS.find(l => nav.startsWith(l.code));
  return hit ? hit.code : DEFAULT_LANG;
}

function applyStaticI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE REGISTRY — English only for this demo. Add entries here (and a
// STRINGS[code] block + optional per-place blocks in data.js) to add languages.
// ─────────────────────────────────────────────────────────────────────────────
const LANGS = [
  { code:'en', name:'English', short:'EN', flag:null, rtl:false },
];
const DEFAULT_LANG = 'en';
function langDef(code){ return LANGS.find(l => l.code === code) || LANGS[0]; }
function langCodes(){ return LANGS.map(l => l.code); }

function updateLangToggle(){
  const d = langDef(LANG);
  const lbl = document.getElementById('lang-label');
  if(lbl){ lbl.innerHTML = '<b>' + d.short + '</b>'; }
  const menu = document.getElementById('lang-menu');
  if(menu){
    menu.innerHTML = LANGS.map(function(l){
      return '<button type="button" class="lang-opt' + (l.code===LANG ? ' active' : '') +
        '" onclick="pickLang(\'' + l.code + '\')"><span>' + l.name + '</span></button>';
    }).join('');
  }
}
function pickLang(code){ applyLang(code); var m = document.getElementById('lang-menu'); if(m) m.style.display = 'none'; }

function applyLang(lang){
  if(!langCodes().includes(lang)) lang = DEFAULT_LANG;
  LANG = lang;
  try { localStorage.setItem('wt_lang', lang); } catch(e){}

  const C  = STRINGS[lang] || STRINGS.en;
  const EN = STRINGS.en;

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
  function relabel(dict, key){ if(typeof dict === 'undefined') return; const src = (C[key] || EN[key] || {}); Object.keys(src).forEach(k => dict[k] = src[k]); }
  if(typeof CL          !== 'undefined') relabel(CL,          'cl');
  if(typeof CAT_LABELS  !== 'undefined') relabel(CAT_LABELS,  'catLabels');
  if(typeof NBHD_LABELS !== 'undefined') relabel(NBHD_LABELS, 'zones');

  document.documentElement.setAttribute('lang', lang);
  if(document.body) document.body.classList.remove('rtl');

  applyStaticI18n();
  updateLangToggle();

  if(typeof setBasemapLang === 'function') setBasemapLang(lang);
  if(typeof renderList === 'function') renderList();
  if(typeof CARD_PLACE !== 'undefined' && CARD_PLACE && typeof _populateCard === 'function') _populateCard(CARD_PLACE);
  if(typeof refreshSavedPill === 'function') refreshSavedPill();
  const si = document.getElementById('search-input'); if(si) si.placeholder = t('search_ph');
}

function toggleLang(){ var m = document.getElementById('lang-menu'); if(!m) return; m.style.display = (m.style.display === 'block') ? 'none' : 'block'; }

// Splash — English only. No other-language buttons in this build.
var SPLASH_OTHER = { en:'Other languages' };
function renderSplashInfo(lang){
  var st = document.getElementById('splash-sub-text');
  var ht = document.getElementById('splash-hours-text');
  var eb = document.getElementById('splash-enter-btn');
  var nt = document.getElementById('splash-note-text');
  if(st) st.textContent = t('splash_welcome');
  if(ht) ht.textContent = t('splash_hours');
  if(eb) eb.textContent = t('splash_enter');
  if(nt) nt.textContent = t('splash_note');
  var info = document.getElementById('splash-info');
  if(info) info.setAttribute('dir', 'ltr');
  var lbl = document.getElementById('splash-otherlang'); if(lbl) lbl.textContent = '';
  var row = document.getElementById('splash-lang-row'); if(row) row.innerHTML = '';
}
function splashEnter(code){
  applyLang(code || 'en');
  if(typeof renderSplashInfo === 'function') renderSplashInfo('en');
  if(typeof closeSplash === 'function') closeSplash();
}
function splashPick(lang){ applyLang(lang); renderSplashInfo(lang); }
function splashReset(){}
function enterIn(lang){ splashEnter(lang); }

document.addEventListener('DOMContentLoaded', function(){
  var L = getLang();
  applyLang(L);
  renderSplashInfo(L);
});
document.addEventListener('click', function(e){
  var m = document.getElementById('lang-menu'), f = document.getElementById('lang-fixed');
  if(m && m.style.display === 'block' && f && !f.contains(e.target) && !m.contains(e.target)) m.style.display = 'none';
});
