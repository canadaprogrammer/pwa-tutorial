const staticCacheName = 'site-static';
const assets = [
    './',
    './index.html',
    './js/app.js',
    './js/ui.js',
    './js/materialize.min.js',
    './css/styles.css',
    './css/materialize.min.css',
    './img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
];
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
self.addEventListener('activate', () => {
    console.log('service worker has been activated.');
});

// fetch event - get source from the server
// service worker will interrupt connection between a browser and a server
self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);

    // using cache
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    )
});