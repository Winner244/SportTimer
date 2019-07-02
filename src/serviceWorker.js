console.log('serviceWorker');

const CACHE_NAME = 'app_serviceworker_v_1';
const needCaches = [ 
	'/',
	'/index.html',
	'/es2015-polyfills.js',
	'/main.js',
	'/polyfills.js',
	'/runtime.js',
	'/vendor.js',
	'/styles.js',
	'/assets/clean.png',
	'/assets/alarm1.wav',
	'/fonts/PTS.ttf',
	'/fonts/PTS-webfont.woff',
];

// Всегда, когда файл запрашивается
self.addEventListener('fetch', fetchEvent => {
	const request = fetchEvent.request;
	console.log('ServiceWorker. fetch: ' + request.url);
	
	//Если файл в списке
	if(needCaches.find(x => location.origin + x === request.url)){
		console.log('ServiceWorker. fetch. is in white list: ' + request.url);
		fetchEvent.respondWith(
			//Запрашиваем данные из интернета
			fetch(request)
				.then(responseFromFetch => { 
					const responce = responseFromFetch.clone();
					console.log('ServiceWorker. fetch. Get Responce: ' + request.url, responce);
					
					//Обновляем кэш
					caches.open(CACHE_NAME)
						.then(cache => {
							cache.put(request, responce);
							console.log('ServiceWorker. Updated cache: ' + request.url);
						});
					
					return responseFromFetch;
				})
				.catch(fetchError => { //Нет интернета
					console.log('ServiceWorker. not network: ' + request.url);
					
					//Достаём из кеша
					return caches.match(request)
						.then(responseFromCache => {
							if (responseFromCache) {
								console.log('ServiceWorker. founded in cache: ' + request.url);
								return responseFromCache;
							}
						}) 
				}) 
		); 
	}
}); 