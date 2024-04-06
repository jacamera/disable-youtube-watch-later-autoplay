chrome.runtime.onInstalled.addListener(
    async details => {
        if (details.reason === 'install') {
            // Open the onboarding page.
            chrome.tabs.create({
                url: chrome.runtime.getURL('hello.html')
            });
            // Manually inject the content script into existing tabs.
            const ytTabs = await chrome.tabs.query({ url: 'https://*.youtube.com/*' });
            for (const tab of ytTabs) {
                await chrome.scripting.executeScript({
                    target: {
                        tabId: tab.id
                    },
                    files: [
                        'content.js'
                    ]
                });
            }
        }
    }
);