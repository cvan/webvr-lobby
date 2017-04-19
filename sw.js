var sw = require('./lib/sw.js');
var hash = require('./.hashes.json').static;

module.exports = sw(hash);
