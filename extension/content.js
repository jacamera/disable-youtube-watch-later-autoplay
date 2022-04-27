const datasetKey = 'disable_youtube_watch_later_autoplay';

function tryFixWatchLaterVideoUrl(element) {
	if (element.tagName !== 'A' && element.tagName !== 'IMG') {
		return null;
	}
	while (element.tagName !== 'A') {
		element = element.parentElement;
		if (!element) {
			return null;
		}
	}
	if (datasetKey in element.dataset) {
		return element.href;
	}
	let url;
	try {
		url = new URL(element.href);
	} catch (_) {
		return null;
	}
	if (
		url.pathname === '/watch' && url.searchParams.get('list') === 'WL'
	) {
		url.searchParams.delete('list');
		url.searchParams.delete('index');
		element.href = url.href;
		element.dataset[datasetKey] = true;
		return url.href;
	}
	return null;
}

// Intercept in-page navigation and perform a full page navigation to the fixed URL instead.
document.body.addEventListener(
	'click',
	e => {
		let href;
		if (href = tryFixWatchLaterVideoUrl(e.target)) {	
			e.preventDefault();
			e.stopPropagation();
			window.location = href;
		}
	},
	{
		capture: true
	}
);

// Fix URLs on middle click event to enable opening videos in a new tab.
document.body.addEventListener(
	'auxclick',
	e => {
		tryFixWatchLaterVideoUrl(e.target);
	}
);

// Fix URLs on context menu event to enable copying URLs and opening videos in a new tab or window.
document.body.addEventListener(
	'contextmenu',
	e => {
		tryFixWatchLaterVideoUrl(e.target);
	}
);