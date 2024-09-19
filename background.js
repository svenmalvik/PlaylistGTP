/**
 * Listens for messages and handles different actions in a Chrome extension
 * @param {Object} request - The message request object
 * @param {Object} sender - The sender of the message
 * @param {function} sendResponse - Function to send a response back to the sender
 * @returns {undefined} This function doesn't return a value
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'triggerContentScript') {
    /**
     * Injects a content script into the active tab of the current window.
     * @param {function} callback - Called after the script injection attempt.
     * @returns {void} This function doesn't return a value.
     */
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      ```
      /**
       * Callback function for script injection
       * @param {void} - No parameters
       * @returns {void} Does not return a value
       */
      ```
      /**
       * Callback function for script injection
       * @param {void} - No parameters
       * @returns {void} No return value
       */
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
