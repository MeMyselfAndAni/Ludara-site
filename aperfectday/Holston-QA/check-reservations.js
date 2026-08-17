// check-reservations.js — link health check for A Perfect Day guides
//
// Reads data.js in the same folder, then requests every reservation link
// (resUrl) and, optionally, every website, following redirects. It prints a
// report and flags anything that does not resolve, so a broken booking link
// gets caught during the monthly data refresh instead of by a guest.
//
// Usage (from inside a guide folder, e.g. HolstonHouse-QA):
//   node check-reservations.js              // checks reservation links only
//   node check-reservations.js --websites   // also checks every website
//   node check-reservations.js --file ../HolstonHouse/data.js
//
// Exit code is 0 when everything resolves, 1 when at least one link fails,
// so it can also be dropped into a script or CI step later.

const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const args = process.argv.slice(2);
const CHECK_WEBSITES = args.includes('--websites');
const fileArg = args.indexOf('--file');
const DATA_FILE = fileArg !== -1 && args[fileArg + 1]
  ? args[fileArg + 1]
  : path.join(__dirname, 'data.js');

const TIMEOUT_MS = 15000;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
         + '(KHTML, like Gecko) Chrome/125.0 Safari/537.36';

// ── Parse data.js line by line (no eval, tolerant of stray globals) ──────────
function parsePlaces(src) {
  const lines = src.split(/\r?\n/);
  const out = [];
  let curName = null;
  const grab = (line, key) => {
    const m = line.match(new RegExp('^\\s*' + key + '\\s*:\\s*"([^"]*)"'));
    return m ? m[1] : null;
  };
  for (const line of lines) {
    const nm = grab(line, 'name');
    if (nm !== null) { curName = nm; continue; }
    const res = grab(line, 'resUrl');
    if (res) out.push({ name: curName, kind: 'reservation', url: res });
    const web = grab(line, 'website');
    if (web) out.push({ name: curName, kind: 'website', url: web });
  }
  return out;
}

// ── One request, following up to 5 redirects. HEAD first, GET on 405/501. ────
// Booking platforms (OpenTable, Resy, Tock) use bot protection that drops or
// challenges scripted requests, so a TIMEOUT / 403 / 429 here does NOT mean the
// link is broken. Results are sorted into three buckets:
//   OK         final status 2xx/3xx           -> link is good
//   DEAD       404 / 410 / DNS fail / refused  -> genuinely broken, fix it
//   UNVERIFIED timeout / 403 / 429 / challenge -> almost always bot-blocking,
//              open it in a browser to be sure
const DEAD_CODES = [400, 404, 410, 451];
const DEAD_ERRORS = ['ENOTFOUND', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENOTDIR'];

function check(url, method = 'HEAD', hops = 0) {
  return new Promise((resolve) => {
    let lib, u;
    try { u = new URL(url); } catch (e) {
      return resolve({ state: 'DEAD', status: 'BAD_URL', note: e.message });
    }
    lib = u.protocol === 'http:' ? http : https;
    const req = lib.request(url, {
      method,
      headers: { 'User-Agent': UA, 'Accept': '*/*' },
    }, (r) => {
      const s = r.statusCode;
      r.resume(); // drain
      if ([301, 302, 303, 307, 308].includes(s) && r.headers.location && hops < 5) {
        const next = new URL(r.headers.location, url).href;
        return resolve(check(next, method, hops + 1));
      }
      if ((s === 405 || s === 501) && method === 'HEAD') {
        return resolve(check(url, 'GET', hops));
      }
      if (s >= 200 && s < 400)       return resolve({ state: 'OK', status: s });
      if (DEAD_CODES.includes(s))    return resolve({ state: 'DEAD', status: s });
      resolve({ state: 'UNVERIFIED', status: s }); // 403/429/5xx/etc.
    });
    req.on('error', (e) => {
      if (method === 'HEAD') return resolve(check(url, 'GET', hops));
      const code = e.code || e.message;
      resolve({ state: DEAD_ERRORS.includes(code) ? 'DEAD' : 'UNVERIFIED', status: code });
    });
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      resolve({ state: 'UNVERIFIED', status: 'TIMEOUT' });
    });
    req.end();
  });
}

async function main() {
  let src;
  try { src = fs.readFileSync(DATA_FILE, 'utf8'); }
  catch (e) { console.error('Cannot read ' + DATA_FILE + ': ' + e.message); process.exit(2); }

  let items = parsePlaces(src).filter(i => i.url && /^https?:\/\//i.test(i.url));
  if (!CHECK_WEBSITES) items = items.filter(i => i.kind === 'reservation');

  console.log('Checking ' + items.length + ' link(s) from ' + path.basename(DATA_FILE)
    + (CHECK_WEBSITES ? ' (reservations + websites)' : ' (reservations only)') + '\n');

  const dead = [], unverified = [];
  const MARK = { OK: 'OK  ', DEAD: 'XX  ', UNVERIFIED: '??  ' };
  for (const it of items) {
    const r = await check(it.url);
    console.log(MARK[r.state] + String(r.status).padEnd(9) + (it.kind === 'reservation' ? '[res] ' : '[web] ')
      + (it.name || '?') + '  ->  ' + it.url);
    if (r.state === 'DEAD') dead.push(it);
    else if (r.state === 'UNVERIFIED') unverified.push({ ...it, status: r.status });
  }

  console.log('\n' + '-'.repeat(60));
  console.log('OK: ' + (items.length - dead.length - unverified.length)
    + '   DEAD: ' + dead.length + '   UNVERIFIED: ' + unverified.length);
  if (unverified.length) {
    console.log('\n?? Could not verify automatically (usually bot protection on OpenTable/Resy/Tock,');
    console.log('   not a broken link). Open these in a browser if you want to be sure:');
    unverified.forEach(f => console.log('  - ' + (f.name || '?') + '  ' + f.url + '  (' + f.status + ')'));
  }
  if (dead.length) {
    console.log('\nXX BROKEN — fix these:');
    dead.forEach(f => console.log('  - ' + (f.name || '?') + ' [' + f.kind + ']  ' + f.url));
    process.exit(1);
  }
  console.log('\nNo broken links found.');
  process.exit(0);
}

main();
