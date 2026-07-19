// A Perfect Day — Winterthur · image credits.
// Demo photos: three from Wikimedia Commons (ids 1, 6, 13), the rest from
// winterthur.org (used with permission for this demo).
// ⚠️ Before public launch, confirm each Wikimedia image's exact author + licence
//    on its Commons file page, and confirm rights for the winterthur.org photos.
var WT_CC = {
  1:  { name: 'Wikimedia Commons', page: 'https://commons.wikimedia.org/wiki/File:Winterthur_Museum_-_DSC01315.jpg' },
  6:  { name: 'Wikimedia Commons', page: 'https://commons.wikimedia.org/wiki/File:Springtime_-_Winterthur_Museum_-_DSC01615.jpg' },
  13: { name: 'Wikimedia Commons', page: 'https://commons.wikimedia.org/wiki/File:Reflecting_Pool_(17174233209).jpg' }
};
// ids whose image comes from winterthur.org
var WT_SITE_IDS = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 16];

function photoCreditHtml(id) {
  var cc = WT_CC[id];
  if (cc) {
    return 'Photo: <a href="' + cc.page + '" target="_blank" rel="noopener">' + cc.name + '</a>';
  }
  if (WT_SITE_IDS.indexOf(id) !== -1) {
    return 'Photo: <a href="https://www.winterthur.org" target="_blank" rel="noopener">winterthur.org</a>';
  }
  return '';
}
