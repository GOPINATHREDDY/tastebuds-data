const staticAssets = [
	'./',
	'./css/styles.css',
	'./css/onsenui.css',
	'./css/onsen-css-components.min.css',
	'./images/placeholder3.jpg',
	'./images/placeholder.png',
	'./js/app.js',
	'./js/onsenui.min.js'
];

self.addEventListener('install', async event => {
	console.log('Installing service worker');
	const cache = await caches.open('tastebuds-static');
	for (f = 0; f < staticAssets.length; f++) {
		cache.add(staticAssets[f]);
		console.log('caching ', staticAssets[f]);
	}
});

self.addEventListener('fetch', event => {
	const req = event.request;
	event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
	const cachedResponse = await caches.match(req);
	if (cachedResponse) {
		console.log('fetching from cache: ' + req.url);
	} else {
		console.log('fetching from network: ' + req.url);
	}
	return cachedResponse || fetch(req);
}

async function networkFirst(req) {
	const cache = await caches.open('tastebuds-dynamic');

	try {
		const res = await fetch(req);
		cache.put(req, res.clone());
		return res;
	} catch (error) {
		const cachedResponse = await cache.match(req);
		return cachedResponse;
	}
}