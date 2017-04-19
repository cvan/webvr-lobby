const fs = require('fs');
const path = require('path');

const globHash = require('glob-hash');

const ROOT_DIR = path.join(__dirname, '..');
const HASH_JS_FILENAME = path.join(ROOT_DIR, '.hashes.json');

const generateHash = module.exports = opts => {
  if (typeof opts === 'string') {
    opts = {include: opts};
  } else {
    opts = opts || {};
  }
  if (!opts.include) {
    opts.include = [ROOT_DIR];
  } else if (!Array.isArray(opts.include)) {
    opts.include = [opts.include];
  }

  return globHash({
    include: opts.include
  }).then(hash => {
    return new Promise((resolve, reject) => {
      fs.writeFile(HASH_JS_FILENAME, JSON.stringify({public: hash}, null, 2) + '\n', err => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  });
};

if (!module.parent) {
  var INCLUDE_LIST = path.join(ROOT_DIR, `{CNAME,*.html,*.js,favicon.ico,*.md,*.webmanifest,img,models}`);
console.log(INCLUDE_LIST);
  generateHash(INCLUDE_LIST).then(hash => {
    console.log('Generated hash "%s" to file "%s"', hash, HASH_JS_FILENAME);
  }).catch(err => {
    console.error('Could not generate hash to file:', err);
  });
}
