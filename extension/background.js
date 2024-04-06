chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open the onboarding page.
    chrome.tabs.create({
      url: chrome.runtime.getURL("hello.html"),
    });
  }
});
