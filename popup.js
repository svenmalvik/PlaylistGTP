/**
 * Initializes event listeners for the extension's popup page
 * @returns {void} This function doesn't return a value
 */
document.addEventListener('DOMContentLoaded', () => {
  /**
   * Adds a click event listener to the AI magic button that triggers the content script
   * @param {void} - No parameters
   /**
    * Listens for messages from the Chrome runtime and handles display actions
    * @param {Object} request - The message object containing the action and content
    * @param {Object} sender - Information about the sender of the message
    * @param {function} sendResponse - Function to send a response back to the sender
    * @returns {undefined} This function does not return a value
    */
   * @returns {void} This function does not return a value
   */
  document.getElementById('ai-magic-button').addEventListener('click', () => {
    const aiMagicButton = document.getElementById('ai-magic-button');
    aiMagicButton.textContent = '...updating';
    aiMagicButton.disabled = true; // Disable the button
    chrome.runtime.sendMessage({ action: 'triggerContentScript' });
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const responseContainer = document.getElementById('response-container');
    if (request.action === 'displayResponse') {
      responseContainer.innerHTML = request.content; // Use innerHTML to render HTML tags

      // Hide the how-to section
      const howToSection = document.querySelector('.how-to');
      if (howToSection) {
        howToSection.style.display = 'none';
      }

      // Show the copy button
      const copyButton = document.getElementById('copy-button');
      copyButton.style.display = 'inline-block';

      // Rename the button back to 'AI magic' and enable it
      const aiMagicButton = document.getElementById('ai-magic-button');
      aiMagicButton.textContent = 'AI magic';
      aiMagicButton.disabled = false; // Enable the button
    } else if (request.action === 'displayError') {
      responseContainer.innerHTML = `<p style="color: red;">${request.content}</p>`; // Display error message in red

      // Rename the button back to 'AI magic' and enable it
      const aiMagicButton = document.getElementById('ai-magic-button');
      aiMagicButton.textContent = 'AI magic';
      aiMagicButton.disabled = false; // Enable the button
    }
  });
/**
 * Copies the specified text to the clipboard using the Clipboard API
 * @param {string} textToCopy - The text to be copied to the clipboard
 * @returns {Promise<void>} A promise that resolves when the text is successfully copied, or rejects with an error if the operation fails
 */

  /**
   * Handles the error if copying fails
   * @param {Error} err - The error object thrown during the copy operation
   * @returns {void} This function doesn't return anything
   */
  /**
   * Adds a click event listener to the copy button that copies the text content of the response container to the clipboard.
   * @param {void} - This function doesn't take any parameters.
   * @returns {void} This function doesn't return a value.
   */
  document.getElementById('copy-button').addEventListener('click', () => {
    const responseContainer = document.getElementById('response-container');
    const textToCopy = responseContainer.innerText; // Get the text content without HTML tags

    navigator.clipboard.writeText(textToCopy).then(() => {
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
});