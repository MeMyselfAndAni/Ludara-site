/* Cross check for a family map: every person NAMED in a place card should be
   linked to that place in people.js, because that link is what the search
   matches on and what the family tree draws when someone clicks a person.

   Two passes, because they are worth different amounts of trust:
     A. the person's full name appears in the card. Near certain.
     B. only a given name appears, and that given name belongs to exactly one
        person in the whole tree. Likely, worth a human eye.

   Run from inside a family map folder. Reports only, changes nothing. */
const fs = require('fs'), vm = require('vm');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data.js', 'utf8') + '\nglobalThis.PLACES = PLACES;', ctx);
vm.runInContext(fs.readFileSync('people.js', 'utf8') + '\nglobalThis.PEOPLE = PEOPLE;', ctx);
const PLACES = ctx.PLACES, PEOPLE = ctx.PEOPLE;

const STOP = new Set(['family', 'the', 'and', 'his', 'her', 'wife', 'husband', 'son', 'daughter',
  'first', 'second', 'operator', 'radio', 'משפחת', 'семья', 'הראשון', 'первый']);

/* "Maria (Masha) Lando" gives the phrases "Maria Lando" and "Masha Lando".
   A name with no surname gives its single token. */
function phrasesOf(s) {
  if (!s) return [];
  /* A bracket in the MIDDLE is another given name: "Maria (Masha) Lando".
     A bracket at the END is a maiden name or a surname: "Raisa Lisits (Kliot)",
     and must never be treated as a given name. */
  const midAlts = [...s.matchAll(/\(([^)]*)\)/g)]
    .filter(m => s.slice(m.index + m[0].length).replace(/[^\p{L}]/gu, '').length > 0)
    .map(m => m[1].trim()).filter(Boolean);
  const alts = midAlts;
  const bare = s.replace(/\([^)]*\)/g, ' ');
  const toks = bare.split(/[^\p{L}]+/u).map(t => t.trim()).filter(t => t.length >= 2 && !STOP.has(t.toLowerCase()));
  const out = [];
  if (toks.length >= 2) {
    out.push(toks);
    alts.forEach(a => {
      const at = a.split(/[^\p{L}]+/u).filter(Boolean);
      if (at.length === 1) out.push([at[0], toks[toks.length - 1]]);   // alternative given name + surname
      else out.push(at);
    });
  } else if (toks.length === 1) {
    out.push(toks);
    alts.forEach(a => out.push([a]));
  }
  return out;
}

/* Russian declines names, so allow up to two extra letters at the end of each
   word: Наор also matches Наора, Ландо also matches Ландовых. */
function phraseRe(tokens) {
  return new RegExp('(?<!\\p{L})' +
    tokens.map(t => escapeRe(t) + '\\p{L}{0,2}').join('[\\s\\u05be-]{1,3}') +
    '(?!\\p{L})', 'iu');
}
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const text = p => [p.name, p.note, p.book, p.search, p.address, p.type].filter(Boolean).join('  ');

// given names that belong to exactly one person in the whole tree
const givenCount = {};
PEOPLE.forEach(per => {
  const set = new Set();
  [per.he, per.ru, per.en].filter(Boolean).forEach(s => {
    phrasesOf(s).forEach(ph => { if (ph.length >= 1) set.add(ph[0].toLowerCase()); });
  });
  set.forEach(g => { (givenCount[g] = givenCount[g] || new Set()).add(per.id); });
});

const full = [], partial = [];

PLACES.forEach(p => {
  const t = text(p);
  PEOPLE.forEach(per => {
    if ((per.places || []).indexOf(p.id) !== -1) return;      // already linked
    const all = [per.he, per.ru, per.en].filter(Boolean).flatMap(phrasesOf);
    const multi = all.filter(ph => ph.length >= 2);
    const hitFull = multi.find(ph => phraseRe(ph).test(t));
    if (hitFull) { full.push([p, per, hitFull.join(' ')]); return; }

    const givens = [...new Set(all.map(ph => ph[0]))];
    // four letters at least: three letter names collide with ordinary words
    const unique = givens.filter(g => g.length >= 4 && (givenCount[g.toLowerCase()] || new Set()).size === 1);
    const hitGiven = unique.find(g => phraseRe([g]).test(t));
    if (hitGiven) partial.push([p, per, hitGiven]);
  });
});

const label = p => String(p.id).padStart(2) + '  ' + p.name.split(' · ').pop();
const who = per => (per.en || per.he) + ' [' + per.id + ']';

function report(title, rows) {
  console.log('\n\n' + title + '  (' + rows.length + ')');
  console.log('-'.repeat(78));
  let last = null;
  rows.forEach(([p, per, m]) => {
    if (p.id !== last) { console.log('\n' + label(p)); last = p.id; }
    console.log('      ' + who(per).padEnd(38) + ' named as "' + m + '"   now linked to [' + (per.places || []).join(',') + ']');
  });
  if (!rows.length) console.log('  none');
}

console.log(PLACES.length + ' places, ' + PEOPLE.length + ' people');
report('A. FULL NAME in the card, but not linked to it', full);
report('B. GIVEN NAME only, and that name is unique in this tree', partial);

const orphan = [];
PEOPLE.forEach(per => (per.places || []).forEach(id => {
  if (!PLACES.find(x => x.id === id)) orphan.push(who(per) + ' points at place ' + id + ', which does not exist');
}));
const noPlaces = PEOPLE.filter(per => !(per.places || []).length);
console.log('\n\nC. People with no places at all  (' + noPlaces.length + ')');
console.log('-'.repeat(78));
noPlaces.forEach(per => console.log('      ' + who(per)));
if (orphan.length) { console.log('\n\nD. Broken links'); orphan.forEach(o => console.log('      ' + o)); }
