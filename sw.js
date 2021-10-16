const staticCacheName = 'site-static-v6';
const dynamicCacheName = 'site-dynamic-v6';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  // '/js/db.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v109/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  '/pages/fallback.html'
];

// LIMIT SIZE OF CACHE FUNCTION
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      console.log('keys:', keys, keys.length);
      if(keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    })
  })
}

// install service worker
self.addEventListener('install', evt => {
  //console.log('service worker has been installed.');
  evt.waitUntil(
  // create cache
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      // save cache
      cache.addAll(assets);
    })
  )
});

// activate service worker when the page is open
// for activating sw when it's changed on dev, check Update on reload on application of dev tool
self.addEventListener('activate', evt => {
  console.log('service worker has been activated.');
  evt.waitUntil(
    caches.keys().then(keys => {
      console.log(keys);
      // delete old key to change the cache
      return Promise.all(keys
      .filter(key => key !== staticCacheName && key !== dynamicCacheName)
      .map(key => caches.delete(key))
      );
    })
  )
});

// fetch event - get source from the server
// service worker will interrupt connection between a browser and a server
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);

  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    // using cache
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        // return cacheRes || fetch(evt.request);
        // CREATE DYNAMIC CACHE WHEN A USER ENTER THE PAGE ON ONLINE
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          });
        }).catch(() => {
          // RETURN FALLBACK CONDITIONALLY
          if(evt.request.url.indexOf('.html') > -1) {
            return caches.match('/pages/fallback.html');
          }
        });
      })
    );
  }
});