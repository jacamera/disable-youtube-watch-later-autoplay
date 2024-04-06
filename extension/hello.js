// Some browsers treat required host permissions as optional so we need to verify that we have permission.
const manifest = chrome.runtime.getManifest(),
  permissions = {
    origins: manifest.host_permissions,
  },
  permissionPrompt = document.getElementById("permission-prompt"),
  welcomeMessage = document.getElementById("welcome-message");

async function beginOnboarding() {
  // Show the welcome message.
  permissionPrompt.style.display = "none";
  welcomeMessage.style.display = "";

  // Manually inject the content script into existing tabs.
  for (const host of manifest.host_permissions) {
    const ytTabs = await chrome.tabs.query({ url: host });
    for (const tab of ytTabs) {
      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        files: ["content.js"],
      });
    }
  }
}

chrome.permissions.contains(permissions).then(async (hasPermissions) => {
  if (hasPermissions) {
    await beginOnboarding();
  } else {
    // Request permissions.
    permissionPrompt.style.display = "";
    document
      .getElementById("permission-button")
      .addEventListener("click", async () => {
        if (await chrome.permissions.request(permissions)) {
          await beginOnboarding();
        }
      });
  }
});
