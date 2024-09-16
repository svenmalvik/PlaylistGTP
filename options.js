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

  apiProviderSelect.addEventListener('change', (event) => {
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

  document.getElementById('openai-model').addEventListener('input', (event) => {
    chrome.storage.sync.set({ openaiModel: event.target.value });
  });

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
