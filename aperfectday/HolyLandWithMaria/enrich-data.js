// ═══════════════════════════════════════════════════════════════════
// enrich-data.js  — fills hours (OpenStreetMap) + missing notes
// (Wikipedia EN + HE) for HolyLandWithMaria/data.js
//
// Run:  node enrich-data.js
// Flags:
//   --notes-only   skip hours
//   --hours-only   skip notes
//   --force        re-check already-tried entries
//
// Saves after every place — Ctrl+C safe, just rerun to continue.
// Already-filled fields are never overwritten.
// Expected time: ~15-25 min for a full pass on 600 places.
// ═══════════════════════════════════════════════════════════════════

const https   = require('https');
const http    = require('http');
const fs      = require('fs');
const path    = require('path');

const DATA    = path.join(__dirname, 'data.js');
const CACHE   = path.join(__dirname, '.enrich-cache.json');
const NOTES_ONLY = process.argv.includes('--notes-only');
const HOURS_ONLY = process.argv.includes('--hours-only');
const FORCE      = process.argv.includes('--force');

// ── HTTP GET ─────────────────────────────────────────────────────
function get(url, ms = 5000) {
  return new Promise(resolve => {
    const t = setTimeout(() => resolve(null), ms);
    const mod = url.startsWith('https') ? https : http;
    let d = '';
    const req = mod.get(url, {
      headers: { 'User-Agent': 'HolyLandWithMaria/1.0 (ludara.ai)' }
    }, res => {
      if ([301,302,303].includes(res.statusCode) && res.headers.location) {
        clearTimeout(t); return resolve(get(res.headers.location, ms));
      }
      res.setEncoding('utf8');
      res.on('data', c => { d += c; if (d.length > 120000) req.destroy(); });
      res.on('end',  () => { clearTimeout(t); resolve(d); });
    });
    req.on('error', () => { clearTimeout(t); resolve(null); });
  });
}
const pj = s => { try { return JSON.parse(s); } catch(e) { return null; } };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── DATA I/O ─────────────────────────────────────────────────────
function load() {
  const code = fs.readFileSync(DATA,'utf8');
  eval(code.replace(/^const PLACES/m,'var PLACES'));
  return PLACES;
}
function save(places) {
  const esc = s => { if (!s && s!==0) return ''; return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/[\n\r]/g,' '); };
  const lines = ['const PLACES = ['];
  places.forEach((p,i) => lines.push(
    '  {id:'+p.id+',nbhd:"'+esc(p.nbhd)+'",name:"'+esc(p.name)+'",cat:"'+esc(p.cat)+
    '",emoji:"'+esc(p.emoji)+'",address:"'+esc(p.address)+'",lat:'+p.lat+',lng:'+p.lng+
    ',search:"'+esc(p.search)+'",note:"'+esc(p.note)+'",hours:"'+esc(p.hours)+
    '",tip:"'+esc(p.tip)+'",type:"'+esc(p.type)+'"}'+(i<places.length-1?',':'')
  ));
  lines.push('];');
  fs.writeFileSync(DATA, lines.join('\n'), 'utf8');
}
function loadCache() { try { return pj(fs.readFileSync(CACHE,'utf8'))||{}; } catch(e) { return {}; } }
function saveCache(c) { fs.writeFileSync(CACHE,JSON.stringify(c),'utf8'); }

// ── WIKIPEDIA NOTE ────────────────────────────────────────────────
function trunc(text, max) {
  if (!text || text.length <= max) return text;
  const c = text.slice(0, max);
  const d = Math.max(c.lastIndexOf('. '), c.lastIndexOf('.\n'));
  return d > 80 ? c.slice(0, d+1) : c;
}
async function wikiNote(name) {
  const q = encodeURIComponent(name.replace(/\s+/g,' ').trim());

  // 1. Direct English summary
  let b = await get('https://en.wikipedia.org/api/rest_v1/page/summary/'+q);
  let j = pj(b);
  if (j?.extract?.length > 80 && j.type !== 'disambiguation') return trunc(j.extract, 450);

  // 2. English search → summary
  b = await get('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+q+'&srnamespace=0&srlimit=1&format=json');
  j = pj(b);
  const t1 = j?.query?.search?.[0]?.title;
  if (t1) {
    b = await get('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(t1));
    j = pj(b);
    if (j?.extract?.length > 80 && j.type !== 'disambiguation') return trunc(j.extract, 450);
  }

  // 3. Hebrew Wikipedia
  b = await get('https://he.wikipedia.org/w/api.php?action=query&list=search&srsearch='+q+'&srnamespace=0&srlimit=1&format=json');
  j = pj(b);
  const t2 = j?.query?.search?.[0]?.title;
  if (t2) {
    b = await get('https://he.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(t2));
    j = pj(b);
    if (j?.extract?.length > 80) return trunc(j.extract, 450);
  }

  return null;
}

// ── OSM HOURS ────────────────────────────────────────────────────
function simScore(a, b) {
  const wa = new Set(a.toLowerCase().replace(/[^\w֐-׿\s]/g,'').split(/\s+/).filter(w=>w.length>2));
  const wb = new Set(b.toLowerCase().replace(/[^\w֐-׿\s]/g,'').split(/\s+/).filter(w=>w.length>2));
  if (!wa.size || !wb.size) return 0;
  let n = 0; wa.forEach(w => { if (wb.has(w)) n++; });
  return n / Math.max(wa.size, wb.size);
}
function fmtHours(raw) {
  return raw.replace(/Mo\b/g,'Mon').replace(/Tu\b/g,'Tue').replace(/We\b/g,'Wed')
    .replace(/Th\b/g,'Thu').replace(/Fr\b/g,'Fri').replace(/Sa\b/g,'Sat').replace(/Su\b/g,'Sun')
    .replace(/\bPH\b/g,'Holidays').replace(/\boff\b/g,'closed')
    .replace(/24\/7/,'Open 24 hours').trim();
}
async function osmHours(place) {
  const d = 0.002; // ~200m bbox
  const bb = `${place.lat-d},${place.lng-d},${place.lat+d},${place.lng+d}`;
  const q = `[out:json][timeout:8];(node["opening_hours"](${bb});way["opening_hours"](${bb}););out body;`;
  const b = await get('https://overpass-api.de/api/interpreter?data='+encodeURIComponent(q), 9000);
  const j = pj(b);
  if (!j?.elements?.length) return null;

  // find best name match
  let best = null, top = 0;
  for (const el of j.elements) {
    const elName = el.tags?.name || el.tags?.['name:en'] || el.tags?.['name:he'] || '';
    const score  = simScore(place.name, elName);
    if (score > top) { top = score; best = el; }
  }
  // accept if score > 0.25 OR only one result
  if ((best && top > 0.25) || j.elements.length === 1) {
    const h = (best || j.elements[0]).tags?.opening_hours;
    if (h) return fmtHours(h);
  }
  return null;
}

// ── MAIN ─────────────────────────────────────────────────────────
async function run() {
  const places = load();
  const cache  = loadCache();
  if (FORCE) for (const k of Object.keys(cache)) delete cache[k];

  const toNote  = HOURS_ONLY ? [] : places.filter(p => !p.note  || !p.note.trim());
  const toHours = NOTES_ONLY ? [] : places.filter(p => !p.hours || !p.hours.trim());

  console.log('\n══════════════════════════════════════════════════');
  console.log('  HolyLandWithMaria — Data Enrichment');
  console.log('══════════════════════════════════════════════════');
  console.log('  Places:       ' + places.length);
  console.log('  Need notes:   ' + toNote.length  + (HOURS_ONLY ? ' (skipped)':''));
  console.log('  Need hours:   ' + toHours.length + (NOTES_ONLY ? ' (skipped)':''));
  console.log('──────────────────────────────────────────────────\n');

  let notesDone=0, hoursDone=0, i=0;

  for (const place of places) {
    i++;
    const pct  = Math.round(i/places.length*100);
    const ck   = String(place.id);
    const cval = cache[ck] || {};
    let changed = false;

    const wantNote  = !HOURS_ONLY && (!place.note  || !place.note.trim())  && (FORCE || !cval.nDone);
    const wantHours = !NOTES_ONLY && (!place.hours || !place.hours.trim()) && (FORCE || !cval.hDone);
    if (!wantNote && !wantHours) continue;

    process.stdout.write(`[${pct}%] #${place.id} ${place.name.slice(0,32).padEnd(32)} `);

    // Run note + hours lookups in parallel
    const [note, hours] = await Promise.all([
      wantNote  ? wikiNote(place.name)  : Promise.resolve(null),
      wantHours ? osmHours(place)       : Promise.resolve(null),
    ]);

    if (note)  { place.note  = note;  notesDone++;  cval.nDone = true; }
    if (hours) { place.hours = hours; hoursDone++;  cval.hDone = true; }
    if (wantNote  && !cval.nDone) cval.nDone = true;   // mark tried even if not found
    if (wantHours && !cval.hDone) cval.hDone = true;

    const nIcon  = wantNote  ? (note  ? '📝' : '·') : ' ';
    const hIcon  = wantHours ? (hours ? '🕐' : '·') : ' ';
    console.log(`${nIcon}${hIcon} ${note?'note':'   '} ${hours?hours.slice(0,30):''}`);

    cache[ck] = cval;
    save(places);
    saveCache(cache);
    changed = true;

    await sleep(250);
  }

  console.log('\n══════════════════════════════════════════════════');
  console.log('  Notes added:  ' + notesDone);
  console.log('  Hours added:  ' + hoursDone);
  console.log('══════════════════════════════════════════════════\n');
}

run().catch(console.error);
