// A Perfect Story Map — Family Edition
// lang.js — single-language mode (HE or RU), chosen on the splash screen.
// The data stays bilingual in data.js/people.js ('עברית · Русский' fields and
// HE\n\nRU paragraphs); applyLanguage() filters every field to the chosen
// script at runtime. Neutral parts (years, numbers, emoji) are always kept.
// Load AFTER data.js + people.js, BEFORE the ui-*.js files use the data.

var LANG = null;   // null = bilingual (never shown after splash), 'he' | 'ru'

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

function applyLanguage(lang){
  LANG = lang;
  document.documentElement.setAttribute('lang', lang === 'he' ? 'he' : 'ru');

  // ── Content: places ──
  if(typeof PLACES !== 'undefined') PLACES.forEach(function(p){
    p.name    = pickLang(p.name);
    p.address = pickLang(p.address);
    p.type    = pickLang(p.type);
    if(p.book)  p.book  = pickLang(p.book);
    if(p.note)  p.note  = pickBlock(p.note);
    if(p.visit) p.visit = pickBlock(p.visit);
  });

  // ── Labels: threads + regions (top-level consts — reference directly) ──
  try { if(typeof CL !== 'undefined')          Object.keys(CL).forEach(function(k){ CL[k] = pickLang(CL[k]); }); } catch(e){}
  try { if(typeof CAT_LABELS !== 'undefined')  Object.keys(CAT_LABELS).forEach(function(k){ CAT_LABELS[k] = pickLang(CAT_LABELS[k]); }); } catch(e){}
  try { if(typeof NBHD_LABELS !== 'undefined') Object.keys(NBHD_LABELS).forEach(function(k){ NBHD_LABELS[k] = pickLang(NBHD_LABELS[k]); }); } catch(e){}

  // ── Static UI texts (plain-text elements only — nothing with child widgets) ──
  document.querySelectorAll(
    '#pill-storypath, #pill-tree, .nbhd-label, #nbhd-title, .pc-tip-label, .loading-text,' +
    '#tree-overlay .tree-title, #tree-overlay .tree-hint, #tree-overlay .tree-btn, #guide-btn'
  ).forEach(function(el){ el.textContent = pickLang(el.textContent.trim()); });

  var h1 = document.querySelector('header .header-text h1');
  if(h1) h1.textContent = lang === 'he' ? 'סיפור המשפחה שלנו' : 'История нашей семьи';
  var sub = document.querySelector('.header-sub');
  if(sub) sub.textContent = lang === 'he' ? 'על פי זיכרונותיה של אנה' : 'по воспоминаниям Анны';
  var st = document.getElementById('sheet-title');
  if(st && typeof PLACES !== 'undefined') st.textContent = PLACES.length + (lang === 'he' ? ' מקומות' : ' мест');
  var si = document.getElementById('topbar-search');
  if(si) si.placeholder = lang === 'he' ? 'מקום או שם…' : 'место или имя…';
  var closeBtn = document.querySelector('#tree-overlay .tree-close');
  if(closeBtn) closeBtn.textContent = lang === 'he' ? '✕ סגירה' : '✕ Закрыть';

  // ── Re-render everything that was built from the data ──
  if(typeof renderList    === 'function') renderList();
  if(typeof applyFilters  === 'function') applyFilters();
  if(typeof window._treeRebuild === 'function') window._treeRebuild();
}

// Splash language buttons
function setLangAndEnter(lang){
  applyLanguage(lang);
  if(typeof closeSplash === 'function') closeSplash();
}
