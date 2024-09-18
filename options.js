/**
 * Initializes and manages the settings page for a Chrome extension that uses AI APIs.
 * This function sets up event listeners for various form elements, loads saved settings,
 * and toggles the visibility of settings based on the selected API provider.
 * @param {void} - No parameters are passed to this function.
 * @returns {void} This function doesn't return a value.
 */
document.addEventListener('DOMContentLoaded', () => {
  const apiProviderSelect = document.getElementById('api-provider');
  const azureSettings = document.getElementById('azure-settings');
  const openaiSettings = document.getElementById('openai-settings');

  // Load saved settings
  chrome.storage.sync.get(['apiProvider', 'azureApiKey', 'azureEndpoint', 'openaiApiKey', 'openaiEndpoint', 'openaiModel'], (config) => {
    if (config.apiProvider) {
      apiProviderSelect.value = config.apiProvider;
      toggleSettings(config.apiProvider);
    }
    if (config.azureApiKey) document.getElementById('azure-api-key').value = config.azureApiKey;
    if (config.azureEndpoint) document.getElementById('azure-endpoint').value = config.azureEndpoint;
    if (config.openaiApiKey) document.getElementById('openai-api-key').value = config.openaiApiKey;
    if (config.openaiEndpoint) document.getElementById('openai-endpoint').value = config.openaiEndpoint;
    if (config.openaiModel) document.getElementById('openai-model').value = config.openaiModel;
  });

  /**
   * Handles the change event for the API provider selection dropdown.
   * @param {Event} event - The change event object.
   * @returns {void} This function does not return a value.
   */
  apiProviderSelect.addEventListener('change', (event) => {
    /**
     * Adds an event listener to the Azure API key input field
     * @param {Event} event - The input event triggered by user interaction
     * @returns {void} This function does not return a value
     ```
     /**
      * Adds an event listener to the 'azure-endpoint' input element that updates the Chrome storage with the new value when the input changes.
      * @param {Event} event - The input event object.
      /**
       * Adds an event listener to the OpenAI API key input field and saves the entered value to Chrome's sync storage.
       * @param {Event} event - The input event triggered when the user types or modifies the API key.
       * @returns {undefined} This function does not return a value.
       */
      * @returns {void} This function does not return a value.
      */
     ```
     */
    /**
     * Adds an event listener to the OpenAI endpoint input field to update storage when the value changes.
     * @param {Event} event - The input event triggered by changes to the field.
     * @returns {void} This function does not return a value.
     */
    const apiProvider = event.target.value;
    chrome.storage.sync.set({ apiProvider });
    toggleSettings(apiProvider);
  });

  document.getElementById('azure-api-key').addEventListener('input', (event) => {
    chrome.storage.sync.set({ azureApiKey: event.target.value });
  });

  document.getElementById('azure-endpoint').addEventListener('input', (event) => {
    chrome.storage.sync.set({ azureEndpoint: event.target.value });
  });

  document.getElementById('openai-api-key').addEventListener('input', (event) => {
    chrome.storage.sync.set({ openaiApiKey: event.target.value });
  });

  document.getElementById('openai-endpoint').addEventListener('input', (event) => {
    chrome.storage.sync.set({ openaiEndpoint: event.target.value });
  });

  /**
   * Adds an event listener to the OpenAI model input element and updates the storage with the selected model.
   * @param {Event} event - The input event triggered when the user changes the OpenAI model selection.
   * @returns {void} This function does not return a value.
   */
  document.getElementById('openai-model').addEventListener('input', (event) => {
    chrome.storage.sync.set({ openaiModel: event.target.value });
  });

  /**
   * Toggles the display of API provider settings based on the selected provider.
   * @param {string} apiProvider - The selected API provider ('openai' or 'azure').
   * @returns {void} This function doesn't return a value.
   */
  function toggleSettings(apiProvider) {
    if (apiProvider === 'openai') {
      azureSettings.style.display = 'none';
      openaiSettings.style.display = 'block';
    } else {
      azureSettings.style.display = 'block';
      openaiSettings.style.display = 'none';
    }
  }
});
