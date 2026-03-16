// ── Photo loading — local files only, no API calls ──────────
// Images stored as: images/place-{id}.jpg
const photoCache = {};

function fetchPhoto(p, callback){
  if(photoCache[p.id] !== undefined){ callback(photoCache[p.id]); return; }

  const basePath = (typeof IMAGES_PATH !== 'undefined') ? IMAGES_PATH : 'images/';
  const url = basePath + 'place-' + p.id + '.jpg';

  photoCache[p.id] = { url: url, attr: '' };
  callback(photoCache[p.id]);
}
