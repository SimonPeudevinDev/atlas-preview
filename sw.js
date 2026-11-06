/* ATLAS — service worker
   Uniquement pour les illustrations (media/dist/i/…) : leurs URL contiennent l’empreinte
   du fichier et ne changent jamais, on peut donc les servir depuis le cache sans
   revalider. Le reste du site (HTML, JS, CSS) n’est pas touché : il passe par le réseau
   comme d’habitude, si bien qu’une mise à jour du site est visible immédiatement.
   Le cache est plafonné pour ne pas grossir sans fin sur mobile. */
var CACHE = 'atlas-media-v1';
var MAX = 900;              // ≈ 900 illustrations (≈ 100 à 200 Mo au pire, bien moins en LOD 0/1)
var MEDIA = /\/i\/[0-9a-f]{2}\/[0-9a-f]{20}\/[0-2]\.(avif|webp|jpg)$/;

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('atlas-media-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

var writes = 0;
function trim(cache) {
  return cache.keys().then(function (keys) {
    if (keys.length <= MAX) return;
    // Les plus anciennes entrées partent en premier (ordre d’insertion)
    return Promise.all(keys.slice(0, keys.length - MAX).map(function (k) { return cache.delete(k); }));
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || !MEDIA.test(new URL(req.url).pathname)) return;
  e.respondWith(caches.open(CACHE).then(function (cache) {
    return cache.match(req, { ignoreVary: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        // Réponses complètes uniquement (ni 206, ni erreurs, ni réponses opaques : le CDN doit envoyer les en-têtes CORS)
        if (res.status === 200) {
          cache.put(req, res.clone());
          if (++writes % 40 === 0) trim(cache);
        }
        return res;
      });
    });
  }));
});
