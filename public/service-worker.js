const CACHE_NAME = 'code-notepad-cache-v2.32';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/notepad_icon.png',
    '/3rdparty/fonts/remixicon.css',
    '/3rdparty/fonts/remixicon.woff',
    '/3rdparty/fonts/remixicon.glyph.json',
    '/3rdparty/fonts/remixicon.woff2',
    '/3rdparty/fonts/remixicon.eot',
    '/3rdparty/fonts/remixicon.ttf',
    '/3rdparty/fonts/remixicon.svg',
];




self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );

    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});


self.addEventListener('activate', function (event) {
    clients.claim();
});