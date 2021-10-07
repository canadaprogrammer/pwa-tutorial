// install service worker
self.addEventListener('install', () => {
    console.log('service worker has been installed.');
});

// activate service worker when the page is open
// for activating sw when it's changed on dev, check Update on reload on application of dev tool
self.addEventListener('activate', () => {
    console.log('service worker has been activated.');
});

// fetch event - get source from the server
// service worker will interrupt connection between a browser and a server
self.addEventListener('fetch', evt => {
    console.log('fetch event', evt);
});