const datasetKey = "disable_youtube_watch_later_autoplay";

const isMacOs = navigator.userAgentData
  ? navigator.userAgentData.platform === "macOS"
  : navigator.userAgent.indexOf("Mac OS X") !== -1;

function tryFixWatchLaterVideoUrl(element) {
  if (element.tagName !== "A") {
    while (element) {
      if (
        element.id === "content" &&
        element.parentElement?.tagName === "YTD-PLAYLIST-VIDEO-RENDERER"
      ) {
        break;
      }
      element = element.parentElement;
    }
    if (!element) {
      return null;
    }
    const videoTitleAnchors = element.querySelectorAll("a#video-title");
    if (videoTitleAnchors.length === 1) {
      element = videoTitleAnchors[0];
    } else {
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
  if (url.pathname === "/watch" && url.searchParams.get("list") === "WL") {
    url.searchParams.delete("list");
    url.searchParams.delete("index");
    element.href = url.href;
    element.dataset[datasetKey] = true;
    return url.href;
  }
  return null;
}

// Fix URLs on click event to enable opening videos in a new tab (with Control or Command keys) or intercept in-page navigation and perform a full page navigation instead.
document.body.addEventListener(
  "click",
  (e) => {
    let href;
    if (
      (href = tryFixWatchLaterVideoUrl(e.target)) &&
      ((isMacOs && !e.metaKey) || (!isMacOs && !e.ctrlKey))
    ) {
      e.preventDefault();
      e.stopPropagation();
      window.location = href;
    }
  },
  {
    capture: true,
  },
);

// Fix URLs on middle click event to enable opening videos in a new tab.
document.body.addEventListener("auxclick", (e) => {
  tryFixWatchLaterVideoUrl(e.target);
});

// Fix URLs on context menu event to enable copying URLs and opening videos in a new tab or window.
document.body.addEventListener("contextmenu", (e) => {
  tryFixWatchLaterVideoUrl(e.target);
});
