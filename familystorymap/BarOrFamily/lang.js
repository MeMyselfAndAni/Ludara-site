// Family Story Map
// lang.js — HEBREW ONLY (BarOrFamily).
// Kept because ui-tree.js and index.html call pickLang()/L3(), and because a few
// UI strings inherited from the Lando-Kliot template are still written as
// 'עברית · Русский · English' triplets. This collapses them to the Hebrew part.
// There is no language switcher in this guide.
// and switchable at any time with the corner language button.
// The data stays trilingual in data.js/people.js ('עברית · Русский · English'
// fields and HE\n\nRU\n\nEN paragraph blocks). On the first applyLanguage()
// call the original values are snapshotted; every switch re-derives from that
// snapshot, so the language can be changed freely without reloading.
// Load AFTER data.js + people.js, BEFORE the ui-*.js files use the data.

var LANG = 'he';   // HEBREW ONLY. This guide never switches language.

function _hasHe(t){ return /[֐-׿]/.test(t); }
function _hasRu(t){ return /[Ѐ-ӿ]/.test(t); }
function _hasEn(t){ return /[A-Za-z]/.test(t); }

// Pick the right value out of he/ru/en by current language
function L3(he, ru, en){ return LANG === 'ru' ? ru : LANG === 'en' ? en : he; }

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

// Paragraph blocks: HE / RU / EN paragraphs — each classified by dominant script
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
                           book: p.book, note: p.note, visit: p.visit };
  });
  try { if(typeof CL !== 'undefined')          Object.keys(CL).forEach(function(k){ _L10N.CL[k] = CL[k]; }); } catch(e){}
  try { if(typeof CAT_LABELS !== 'undefined')  Object.keys(CAT_LABELS).forEach(function(k){ _L10N.CAT[k] = CAT_LABELS[k]; }); } catch(e){}
  try { if(typeof NBHD_LABELS !== 'undefined') Object.keys(NBHD_LABELS).forEach(function(k){ _L10N.NBHD[k] = NBHD_LABELS[k]; }); } catch(e){}
  document.querySelectorAll(_UI_SELECTOR).forEach(function(el){
    _L10N.ui.push([el, el.textContent.trim()]);
  });
}

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

  var h1 = document.querySelector('header .header-text h1');
  if(h1) h1.textContent = L3('משפחת לנדו־קליוט', 'Семья Ландо-Клиот', 'The Lando–Kliot Family');
  var sub = document.querySelector('.header-sub');
  if(sub) sub.textContent = L3('על פי זיכרונותיה של אנה', 'по воспоминаниям Анны', 'from the memoirs of Anna');
  var st = document.getElementById('sheet-title');
  if(st && typeof PLACES !== 'undefined') st.textContent = PLACES.length + L3(' מקומות', ' мест', ' places');
  var si = document.getElementById('topbar-search');
  if(si) si.placeholder = L3('מקום או שם…', 'место или имя…', 'place or name…');
  var closeBtn = document.querySelector('#tree-overlay .tree-close');
  if(closeBtn) closeBtn.textContent = L3('✕ סגירה', '✕ Закрыть', '✕ Close');

  // Button labels that were plain English in the template
  var _setTxt = function(id, txt){ var el = document.getElementById(id); if(el) el.textContent = txt; };
  _setTxt('pill-saved-label',   L3('סימניות', 'Закладки', 'Bookmarks'));
  _setTxt('desktop-list-label', L3('מקומות', 'Места', 'Places'));
  _setTxt('nbhd-all-label',     L3('הכול', 'Все', 'All'));
  _setTxt('saved-panel-label',  L3('הסימניות שלכם', 'Ваши закладки', 'Your bookmarks'));
  _setTxt('saved-route-btn',    L3('🗺 מסלול מלא', '🗺 Весь маршрут', '🗺 Full itinerary'));
  _setTxt('saved-pdf-btn',      '📄 PDF');
  _setTxt('saved-map-btn',      L3('🖼 שמירת מפה', '🖼 Сохранить карту', '🖼 Save map'));
  _setTxt('trip-pdf-btn',       '⬇ PDF');
  _setTxt('trip-share-btn',     L3('🔗 שיתוף', '🔗 Поделиться', '🔗 Share'));
  _setTxt('sheet-clear-label',  L3('🗑 ניקוי', '🗑 Очистить', '🗑 Clear'));

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

// In-map language toggle: cycles he → ru → en → he
function toggleLanguage(){ /* Hebrew-only guide: no-op */ }

// Splash language buttons
function setLangAndEnter(){ if(typeof enterStory==='function') enterStory(); }


/* Hebrew-only: collapse every inherited triplet as soon as the DOM is ready. */
document.addEventListener('DOMContentLoaded', function(){ try { applyLanguage('he'); } catch(e){} });
