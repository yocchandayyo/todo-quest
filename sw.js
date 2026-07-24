const CACHE = 'todo-quest-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './todo-quest-assets/hero.png',
  './todo-quest-assets/hero_knight.png',
  './todo-quest-assets/hero_ninja.png',
  './todo-quest-assets/hero_mage.png',
  './todo-quest-assets/hero_hime.png',
  './todo-quest-assets/hero_king.png',
  './todo-quest-assets/hero_monk.png',
  './todo-quest-assets/hero_dark.png',
  './todo-quest-assets/mon_easy.png',
  './todo-quest-assets/mon_normal.png',
  './todo-quest-assets/mon_hard.png',
  './todo-quest-assets/mon_epic.png',
  './todo-quest-assets/mon_metal.png',
  './todo-quest-assets/mon_golem.png',
  './todo-quest-assets/mon_boss.png',
  './todo-quest-assets/wp_copper.png',
  './todo-quest-assets/wp_steel.png',
  './todo-quest-assets/wp_flame.png',
  './todo-quest-assets/wp_legend.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// BGM(mp3)はキャッシュせずネットワーク優先、他はキャッシュ優先
self.addEventListener('fetch', e => {
  if (e.request.url.endsWith('.mp3')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }))
  );
});
