/* Kat'Pat' — garde une copie de l'appli pour qu'elle s'ouvre sans réseau.
   Toujours le réseau d'abord (pour avoir la dernière version), la copie seulement si le réseau manque.
   Pour forcer un nettoyage complet : changer le numéro de VERSION. */
var VERSION = "katpat-v1";
var BASE = ["./app.html", "./index.html", "./data/donnees.js", "./manifest.webmanifest",
  "./assets/fonts/fraunces-latin.woff2", "./assets/fonts/inter-latin.woff2",
  "./assets/concours-app.jpg", "./assets/icon-192.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(BASE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) { var copie = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copie); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (r) { return r || caches.match("./app.html"); });
  }));
});
