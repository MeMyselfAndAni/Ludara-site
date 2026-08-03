// lang.js: SHARED ENGINE FILE. Identical in every family map.
// Single-language mode, chosen on the splash screen and switchable with the corner
// language button. FAMILY.languages decides which languages exist: a single-entry
// list (e.g. ['he']) locks the map to that language and makes the switcher a no-op.
// The data stays trilingual in data.js/people.js ('עברית · Русский · English'
// fields and HE\n\nRU\n\nEN paragraph blocks). On the first applyLanguage()
// call the original values are snapshotted; every switch re-derives from that
// snapshot, so the language can be changed freely without reloading.
// Load AFTER data.js + people.js, BEFORE the ui-*.js files use the data.

var LANGS = (typeof FAMILY !== 'undefined' && FAMILY.languages) || ['he','ru','en'];
// null = multilingual (only before the splash choice). A one-language map starts
// locked, so inherited 'עברית · Русский · English' triplets collapse immediately.
var LANG = LANGS.length === 1 ? LANGS[0] : null;

function _hasHe(t){ return /[֐-׿]/.test(t); }
function _hasRu(t){ return /[Ѐ-ӿ]/.test(t); }
function _hasEn(t){ return /[A-Za-z]/.test(t); }

// Pick the right value out of he/ru/en by current language
function L3(he, ru, en){ return LANG === 'ru' ? ru : LANG === 'en' ? en : he; }

// Short alias used by the ui-*.js templates for inline UI strings.
function _T(he, ru, en){ return L3(he, ru, en); }

// One-line trilingual strings: 'עברית · Русский · English · 1910' →
// keep the parts of my script + neutral parts (years, emoji, numbers)
function pickLang(str){
  if(!LANG || !str) return str;
  var parts = String(str).split(' · ');
  var keep = parts.filter(function(t){
    var he = _hasHe(t), ru = _hasRu(t), en = _hasEn(t);
    if(he) return LANG === 'he';       // Hebrew part (may contain Latin brand names)
    if(ru) return LANG === 'ru';       // Cyrillic part
    if(en) return LANG === 'en';       // Latin-only part = English
    return true;                       // neutral (years, emoji, numbers)
  });
  return keep.join(' · ') || str;
}

// Paragraph blocks: HE / RU / EN paragraphs, each classified by dominant script
function pickBlock(str){
  if(!LANG || !str) return str;
  var paras = String(str).split(/\n\s*\n/);
  if(paras.length === 1) paras = String(str).split('\n');
  var keep = paras.filter(function(t){
    var heC = (t.match(/[֐-׿]/g) || []).length;
    var ruC = (t.match(/[Ѐ-ӿ]/g) || []).length;
    var enC = (t.match(/[A-Za-z]/g) || []).length;
    if(!heC && !ruC && !enC) return true;                  // neutral
    var max = Math.max(heC, ruC, enC);
    if(LANG === 'he') return heC === max;
    if(LANG === 'ru') return ruC === max;
    return enC === max && heC < max && ruC < max;          // en: mostly Latin
  });
  return keep.join('\n\n') || str;
}

// ── Snapshot of the original trilingual values (taken once, on first switch) ──
var _L10N = null;
var _UI_SELECTOR =
  '#pill-storypath, #tree-fab-label, .nbhd-label, #nbhd-title, .pc-tip-label, .loading-text,' +
  '#tree-overlay .tree-title, #tree-overlay .tree-hint, #tree-overlay .tree-btn, #guide-btn';

function _snapshot(){
  if(_L10N) return;
  _L10N = { places: {}, CL: {}, CAT: {}, NBHD: {}, ui: [] };
  if(typeof PLACES !== 'undefined') PLACES.forEach(function(p){
    _L10N.places[p.id] = { name: p.name, address: p.address, type: p.type,
                           book: p.book, note: p.note, visit: p.visit,
                           years: p.years };
  });
  try { if(typeof CL !== 'undefined')          Object.keys(CL).forEach(function(k){ _L10N.CL[k] = CL[k]; }); } catch(e){}
  try { if(typeof CAT_LABELS !== 'undefined')  Object.keys(CAT_LABELS).forEach(function(k){ _L10N.CAT[k] = CAT_LABELS[k]; }); } catch(e){}
  try { if(typeof NBHD_LABELS !== 'undefined') Object.keys(NBHD_LABELS).forEach(function(k){ _L10N.NBHD[k] = NBHD_LABELS[k]; }); } catch(e){}
  document.querySelectorAll(_UI_SELECTOR).forEach(function(el){
    _L10N.ui.push([el, el.textContent.trim()]);
  });
}

// The tree overlay is built by ui-tree.js on the window 'load' event, which is
// often AFTER the reader has picked a language on the splash. _snapshot() only
// runs once, so if the overlay did not exist yet its header was never captured
// and kept showing all three languages at once, no matter how often the reader
// switched. Re-derive it straight from FAMILY instead of from the snapshot, and
// let ui-tree.js call this again once it has injected the overlay.
function _applyTreeLang(){
  var t = (typeof FAMILY !== 'undefined' && FAMILY.tree) || {};
  var set = function(el, val){ if(el && val) el.textContent = pickLang(val); };
  set(document.querySelector('#tree-overlay .tree-title'), t.title);
  set(document.querySelector('#tree-overlay .tree-hint'),  t.hint);
  set(document.getElementById('tree-btn-all'),             t.allChip);
  (t.branches || []).forEach(function(b){
    set(document.getElementById('tree-btn-' + b.key), b.chip);
  });
  var closeBtn = document.querySelector('#tree-overlay .tree-close');
  if(closeBtn) closeBtn.textContent = L3('✕ סגירה', '✕ Закрыть', '✕ Close');
}
window._applyTreeLang = _applyTreeLang;

function applyLanguage(lang){
  _snapshot();               // capture trilingual originals before the first filter
  LANG = lang;
  document.documentElement.setAttribute('lang', lang);

  // ── Content: places (always re-derived from the snapshot) ──
  if(typeof PLACES !== 'undefined') PLACES.forEach(function(p){
    var o = _L10N.places[p.id];
    if(!o) return;
    p.name    = pickLang(o.name);
    p.address = pickLang(o.address);
    p.years   = o.years !== undefined ? pickLang(o.years) : p.years;
    p.type    = pickLang(o.type);
    p.book    = o.book  ? pickLang(o.book)   : o.book;
    p.note    = o.note  ? pickBlock(o.note)  : o.note;
    p.visit   = o.visit ? pickBlock(o.visit) : o.visit;
  });

  // ── Labels: threads + regions ──
  try { if(typeof CL !== 'undefined')          Object.keys(_L10N.CL).forEach(function(k){ CL[k] = pickLang(_L10N.CL[k]); }); } catch(e){}
  try { if(typeof CAT_LABELS !== 'undefined')  Object.keys(_L10N.CAT).forEach(function(k){ CAT_LABELS[k] = pickLang(_L10N.CAT[k]); }); } catch(e){}
  try { if(typeof NBHD_LABELS !== 'undefined') Object.keys(_L10N.NBHD).forEach(function(k){ NBHD_LABELS[k] = pickLang(_L10N.NBHD[k]); }); } catch(e){}

  // ── Static UI texts (restored from snapshot, then filtered) ──
  _L10N.ui.forEach(function(pair){ pair[0].textContent = pickLang(pair[1]); });

  // The header comes from FAMILY, which is the one file that knows which family
  // this map is about. It used to be a hardcoded L3(...) literal here, so entering
  // a COPIED map overwrote its header with the previous family's name.
  var h1 = document.querySelector('header .header-text h1');
  if(h1 && FAMILY.title) h1.textContent = pickLang(FAMILY.title);
  var sub = document.querySelector('.header-sub');
  if(sub && FAMILY.credit){
    // Replace only the text, keeping any nested markup (the " · by Ludara" span),
    // which a plain textContent assignment would silently delete.
    var _keep = [].slice.call(sub.children);
    sub.textContent = pickLang(FAMILY.credit);
    _keep.forEach(function(el){ sub.appendChild(el); });
  }

  var st = document.getElementById('sheet-title');
  if(st && typeof PLACES !== 'undefined') st.textContent = PLACES.length + L3(' מקומות', ' мест', ' places');
  var si = document.getElementById('topbar-search');
  if(si) si.placeholder = L3('מקום או שם…', 'место или имя…', 'place or name…');
  _applyTreeLang();

  // Button labels that were plain English in the template
  // getElementById returns only the FIRST element with an id, so a stray duplicate
  // id in the markup silently swallows the translation. That has now bitten twice:
  // the Clear chip, and the Places button (a dead display:none copy of
  // #desktop-list-label sat earlier in the document and absorbed every update).
  // Setting every element that carries the id makes the bug impossible.
  var _setTxt = function(id, txt){
    document.querySelectorAll('[id="' + id + '"]').forEach(function(el){ el.textContent = txt; });
  };
  _setTxt('pill-saved-label',   L3('סימניות', 'Закладки', 'Bookmarks'));
  _setTxt('desktop-list-label', L3('מקומות', 'Места', 'Places'));
  _setTxt('nbhd-all-label',     L3('הכול', 'Все', 'All'));
  _setTxt('saved-panel-label',  L3('הסימניות שלכם', 'Ваши закладки', 'Your bookmarks'));
  _setTxt('saved-route-btn',    L3('🗺 מסלול מלא', '🗺 Весь маршрут', '🗺 Full itinerary'));
  _setTxt('saved-pdf-btn',      '📄 PDF');
  _setTxt('saved-map-btn',      L3('🖼 שמירת מפה', '🖼 Сохранить карту', '🖼 Save map'));
  _setTxt('trip-pdf-btn',       '⬇ PDF');
  _setTxt('trip-share-btn',     L3('🔗 שיתוף', '🔗 Поделиться', '🔗 Share'));
  // The markup carried two ids on this one button, so 'sheet-clear-label' matched
  // nothing and the Clear chip stayed English. Target the real id.
  _setTxt('sheet-clear-btn',    L3('🗑 ניקוי', '🗑 Очистить', '🗑 Clear'));
  var _scb = document.getElementById('sheet-clear-btn');
  if(_scb) _scb.title = L3('ניקוי כל הסימניות', 'Очистить все закладки', 'Clear all bookmarks');
  var _tt = document.querySelector('.trip-title');
  if(_tt) _tt.textContent = L3('🗺 המסלול שלכם', '🗺 Ваш маршрут', '🗺 Your itinerary');

  // Corner language button: highlight the active code
  var lf = document.getElementById('lang-fab');
  if(lf){
    lf.classList.toggle('lf-on-he', lang === 'he');
    lf.classList.toggle('lf-on-ru', lang === 'ru');
    lf.classList.toggle('lf-on-en', lang === 'en');
    lf.title = L3('Переключить язык / switch language', 'החלפת שפה / switch language', 'החלפת שפה / сменить язык');
  }

  // ── Re-render everything that was built from the data ──
  if(typeof closePlaceCard === 'function') closePlaceCard(true);
  if(typeof renderList    === 'function') renderList();
  if(typeof applyFilters  === 'function') applyFilters();
  if(typeof window._treeRebuild === 'function') window._treeRebuild();
}

// In-map language toggle: cycles through FAMILY.languages. A one-language map has
// nothing to cycle to, so this is a no-op there rather than a special-cased file.
function toggleLanguage(){
  if(LANGS.length < 2) return;
  applyLanguage(LANGS[(LANGS.indexOf(LANG) + 1) % LANGS.length]);
}

// Splash language buttons
function setLangAndEnter(lang){
  // Entering the story must not depend on applyLanguage() succeeding. If anything
  // inside it throws (a filter that needs the map before the map exists, say) the
  // reader would be stranded on a splash screen whose button appears to do nothing.
  try { applyLanguage(LANGS.indexOf(lang) >= 0 ? lang : LANGS[0]); }
  catch(e){ if(window.console) console.warn('applyLanguage:', e && e.message); }
  if(typeof closeSplash === 'function') closeSplash();
  else if(typeof enterStory === 'function') enterStory();
}

// A one-language map collapses its inherited triplets as soon as the DOM is ready;
// a multilingual one waits for the reader's choice on the splash.
if(LANGS.length === 1){
  document.addEventListener('DOMContentLoaded', function(){
    try { applyLanguage(LANGS[0]); } catch(e){}
  });
}
