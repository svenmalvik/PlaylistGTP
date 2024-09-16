document.addEventListener('DOMContentLoaded', () => {
  // Load settings from storage
  chrome.storage.sync.get(['apiProvider', 'azureApiKey', 'azureEndpoint', 'openaiApiKey', 'openaiEndpoint', 'openaiModel'], (data) => {
    document.getElementById('api-provider').value = data.apiProvider || 'azure';
    document.getElementById('azure-api-key').value = data.azureApiKey || '';
    document.getElementById('azure-endpoint').value = data.azureEndpoint || '';
    document.getElementById('openai-api-key').value = data.openaiApiKey || '';
    document.getElementById('openai-endpoint').value = data.openaiEndpoint || '';
    document.getElementById('openai-model').value = data.openaiModel || '';

    toggleSettings(data.apiProvider || 'azure');
  });

  // Save settings to storage
  document.getElementById('api-provider').addEventListener('change', (event) => {
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
      document.getElementById('azure-settings').style.display = 'none';
      document.getElementById('openai-settings').style.display = 'block';
    } else {
      document.getElementById('azure-settings').style.display = 'block';
      document.getElementById('openai-settings').style.display = 'none';
    }
  }
});
