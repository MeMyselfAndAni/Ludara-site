const fs = require('fs');
eval(fs.readFileSync('data.js','utf8').replace(/^const PLACES/m,'var PLACES'));
var withHours = PLACES.filter(function(p){ return p.hours && p.hours.trim(); }).length;
var noHours   = PLACES.filter(function(p){ return !p.hours || !p.hours.trim(); }).length;
console.log('Total places : ' + PLACES.length);
console.log('With hours   : ' + withHours);
console.log('Without hours: ' + noHours);
console.log('\nSample (first 5 with hours):');
PLACES.filter(function(p){ return p.hours && p.hours.trim(); }).slice(0,5).forEach(function(p){
  console.log('  #' + p.id + ' ' + p.name.slice(0,35) + ' | ' + p.hours.slice(0,60));
});
