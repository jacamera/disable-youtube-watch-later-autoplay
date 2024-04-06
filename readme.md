# Disable YouTube Watch Later Autoplay

## Description

This browser extension disables the Watch Later autoplay behavior when selecting a video from the Watch Later list.

### Background

The YouTube Watch Later feature lets users save a video to watch at a later time. When selecting a video from the Watch Later list YouTube will then always autoplay every subsequent video from the list. This happens because YouTube treats the Watch Later list just like any other playlist and there is no way to disable autoplay when viewing videos in a playlist.

## How to Use the Extension

Just install the extension from the [Chrome](https://chrome.google.com/webstore/detail/disable-youtube-watch-lat/pipapjplioodfcahamejlgfloniakbpa) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/disable-youtube-wl-autoplay/) stores. Once installed, the extension works automatically. When you click on a video on the Watch Later list the extension will remove the playlist parameters from the video URL, allowing you to watch the video or copy the URL without the default autoplaying playlist behavior.

## How it Works

The extension injects a content script into the YouTube web page which then listens for mouse events. If a click is detected on a video from the Watch Later playlist then the extension modifies the video URL to remove the playlist query string parameters.

If a click is detected that would cause a navigation to the video then the default in-page navigation behavior is prevented and a full page load is triggered. This is necessary due to the fact that changing the `href` attributes on the anchor elements does not affect the behavior of YouTube's in-page navigation system. Even if the all the `href` attributes are changed before any click events are triggered the in-page navigation will always load the video with the rest of the playlist.
