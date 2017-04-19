/* eslint-env browser */
'use strict';

// Credits:
// Adapted from https://serviceworke.rs/strategy-cache-and-update_index_doc.html

// NOTE: The Service Worker API has secure-origin restrictions:
// https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
var swCanRegister = ('serviceWorker' in navigator &&
  (window.location.protocol === 'https:' ||
  (window.location.hostname === 'localhost' ||
   window.location.hostname.indexOf('127.') === 0)));

// Register the Service Worker, limiting its action to those URL starting
// by `./`. The scope is not a path but a prefix. First, it is
// converted into an absolute URL, then used to determine if a page is
// controlled by testing if it is a prefix of the request URL.
if (swCanRegister) {
  // Delay registration until after the page has loaded, to ensure that our
  // pre-caching requests don't degrade the first visit experience.
  // See https://developers.google.com/web/fundamentals/instant-and-offline/service-worker/registration
  navigator.serviceWorker.register('sw.js').then(function (reg) {
    // `updatefound` is fired if `sw.js` changes.
    reg.addEventListener('updatefound', function () {
      // The `updatefound` event implies that reg.installing is set; see
      // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
      var installingWorker = reg.installing;

      installingWorker.addEventListener('statechange', function () {
        switch (installingWorker.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // At this point, the old content will have been purged and the
              // fresh content will have been added to the cache. It's the
              // perfect time to display a message in the page's interface,
              // like so: "New content is available; please refresh."
              console.log('New content is available');
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a message, like so:
              // "Content is cached for offline use."
              console.log('Content is now available offline');
            }
            break;
          case 'redundant':
            console.error('The in-progress Service Worker became redundant');
            break;
        }
      });
    }).catch(function (err) {
      console.error('Error occurred registering Service Worker:', err);
    });
  });

  navigator.serviceWorker.ready.then(function () {
    // The Service Worker is now active.
    console.log('Service Worker is ready and active');
  });
}
