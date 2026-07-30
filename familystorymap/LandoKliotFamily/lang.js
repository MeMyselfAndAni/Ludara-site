// Family Story Map
// lang.js — single-language mode (HE or RU), chosen on the splash screen and
// switchable at any time with the 🌐 pill inside the map.
// The data stays bilingual in data.js/people.js ('עברית · Русский' fields and
// HE\n\nRU paragraphs). On the first applyLanguage() call the original
// bilingual values are snapshotted; every switch re-derives from that
// snapshot, so the language can be changed back and forth without reloading.
// Load AFTER data.js + people.js, BEFORE the ui-*.js files use the data.

var LANG = null;   // null = bilingual (only before the splash choice), 'he' | 'ru'

function _hasHe(t){ return /[֐-׿]/.test(t); }
function _hasRu(t){ return /[Ѐ-ӿ]/.test(t); }

// One-line bilingual strings: 'עברית · Русский · 1910' → keep my script + neutral
function pickLang(str){
  if(!LANG || !str) return str;
  var parts = String(str).split(' · ');
  var keep = parts.filter(function(t){
    var he = _hasHe(t), ru = _hasRu(t);
    if(he && ru) return true;      // mixed part — keep
    if(he) return LANG === 'he';
    if(ru) return LANG === 'ru';
    return true;                   // neutral (years, emoji, numbers)
  });
  return keep.join(' · ') || str;
}

// Paragraph blocks: HE paragraph(s) + RU paragraph(s) separated by blank lines
function pickBlock(str){
  if(!LANG || !str) return str;
  var paras = String(str).split(/\n\s*\n/);
  if(paras.length === 1) paras = String(str).split('\n');
  var keep = paras.filter(function(t){
    var heC = (t.match(/[֐-׿]/g) || []).length;
    var ruC = (t.match(/[Ѐ-ӿ]/g) || []).length;
    if(!heC && !ruC) return true;
    return LANG === 'he' ? heC >= ruC : ruC >= heC;
  });
  return keep.join('\n\n') || str;
}

// ── Snapshot of the original bilingual values (taken once, on first switch) ──
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
  _snapshot();               // capture bilingual originals before the first filter
  LANG = lang;
  document.documentElement.setAttribute('lang', lang === 'he' ? 'he' : 'ru');

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
  if(h1) h1.textContent = lang === 'he' ? 'משפחת לנדו־קליוט' : 'Семья Ландо-Клиот';
  var sub = document.querySelector('.header-sub');
  if(sub) sub.textContent = lang === 'he' ? 'על פי זיכרונותיה של אנה' : 'по воспоминаниям Анны';
  var st = document.getElementById('sheet-title');
  if(st && typeof PLACES !== 'undefined') st.textContent = PLACES.length + (lang === 'he' ? ' מקומות' : ' мест');
  var si = document.getElementById('topbar-search');
  if(si) si.placeholder = lang === 'he' ? 'מקום או שם…' : 'место или имя…';
  var closeBtn = document.querySelector('#tree-overlay .tree-close');
  if(closeBtn) closeBtn.textContent = lang === 'he' ? '✕ סגירה' : '✕ Закрыть';

  // The HE/RU corner toggle highlights the active language
  var lf = document.getElementById('lang-fab');
  if(lf){
    lf.classList.toggle('lf-on-he', lang === 'he');
    lf.classList.toggle('lf-on-ru', lang === 'ru');
    lf.title = lang === 'he' ? 'Переключить на русский' : 'מעבר לעברית';
  }

  // ── Re-render everything that was built from the data ──
  if(typeof closePlaceCard === 'function') closePlaceCard(true);
  if(typeof renderList    === 'function') renderList();
  if(typeof applyFilters  === 'function') applyFilters();
  if(typeof window._treeRebuild === 'function') window._treeRebuild();
}

// In-map language toggle (the 🌐 pill)
function toggleLanguage(){
  applyLanguage(LANG === 'he' ? 'ru' : 'he');
}

// Splash language buttons
function setLangAndEnter(lang){
  applyLanguage(lang);
  if(typeof closeSplash === 'function') closeSplash();
}
