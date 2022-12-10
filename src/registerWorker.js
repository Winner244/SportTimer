//Регистрируем воркера. 
//Просмотр воркеров в браузере: chrome://inspect/#service-workers
navigator
	.serviceWorker
	.register('/serviceWorker.js');