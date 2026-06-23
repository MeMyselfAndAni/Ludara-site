// ── Photo attribution per place id ──────────────────────────────
// Drisco demo: cards use category gradients (no photos yet), so there are
// no credits to show. When real, properly-licensed images are added,
// add one entry per image here: { author, license, url }.
const PHOTO_CREDITS = {};

function photoCreditHtml(id){
  var c = (typeof PHOTO_CREDITS !== 'undefined') ? PHOTO_CREDITS[id] : null;
  if(!c) return '';
  var inner = c.author + (c.license ? ' · ' + c.license : '');
  return c.url ? '<a href="' + c.url + '" target="_blank" rel="noopener">' + inner + '</a>' : inner;
}
