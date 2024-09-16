document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const apiKeyInput = document.getElementById('api-key');
  const endpointInput = document.getElementById('endpoint');

  // Load the current settings
  chrome.storage.sync.get(['darkMode', 'apiKey', 'endpoint'], (settings) => {
    darkModeToggle.checked = settings.darkMode || false;
    apiKeyInput.value = settings.apiKey || '';
    endpointInput.value = settings.endpoint || '';
  });

  // Save the dark mode setting when the toggle is changed
  darkModeToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
  });

  // Save the API key when it is changed
  apiKeyInput.addEventListener('input', () => {
    chrome.storage.sync.set({ apiKey: apiKeyInput.value });
  });

  // Save the endpoint when it is changed
  endpointInput.addEventListener('input', () => {
    chrome.storage.sync.set({ endpoint: endpointInput.value });
  });
});
