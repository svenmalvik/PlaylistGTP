chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'triggerContentScript') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Script injection failed: ", chrome.runtime.lastError);
        } else {
          console.log("Script injected successfully");
        }
      });
    });
  } else if (request.action === 'openaiResponse') {
    // Forward the response to the popup
    chrome.runtime.sendMessage({ action: 'displayResponse', content: request.content });
  }
});
