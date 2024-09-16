document.addEventListener('DOMContentLoaded', () => {
  // Check the dark mode setting
  chrome.storage.sync.get('darkMode', (data) => {
    if (data.darkMode) {
      document.body.classList.add('dark-mode');
    }
  });

  document.getElementById('ai-magic-button').addEventListener('click', () => {
    const aiMagicButton = document.getElementById('ai-magic-button');
    aiMagicButton.textContent = '...updating';
    aiMagicButton.disabled = true; // Disable the button
    chrome.runtime.sendMessage({ action: 'triggerContentScript' });
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'displayResponse') {
      const responseContainer = document.getElementById('response-container');
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
      const responseContainer = document.getElementById('response-container');
      responseContainer.innerHTML = `<p style="color: red;">${request.content}</p>`; // Display error message in red

      // Rename the button back to 'AI magic' and enable it
      const aiMagicButton = document.getElementById('ai-magic-button');
      aiMagicButton.textContent = 'AI magic';
      aiMagicButton.disabled = false; // Enable the button
    }
  });

  document.getElementById('copy-button').addEventListener('click', () => {
    const responseContainer = document.getElementById('response-container');
    const textToCopy = responseContainer.innerText; // Get the text content without HTML tags

    navigator.clipboard.writeText(textToCopy).then(() => {
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  });
});