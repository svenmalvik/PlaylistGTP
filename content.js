(function() {
  console.log("Content script loaded");

  // Fail fast if the current page's URL does not end with /copyright
  if (!window.location.href.endsWith('/copyright')) {
    chrome.runtime.sendMessage({ action: 'displayError', content: 'Invalid URL: Please follow the instructions below.👇' });
    return;
  }

  const pageTitle = document.title;
  console.log("Page title is:", pageTitle);

  // Get all elements with the tag name 'ytcr-video-content-list-claim-row'
  const elements = document.querySelectorAll('ytcr-video-content-list-claim-row');
  console.log("Found elements:", elements);

  // Collect all innerText values into a single string with 2 line breaks between each
  let allInnerText = '';
  elements.forEach(element => {
    allInnerText += element.innerText + '\n\n';
  });

  console.log("All innerText combined:", allInnerText);

  // Function to send the collected text to the selected API
  async function sendToAPI(prompt) {
    // Retrieve the API provider, API key, endpoint, and model from storage
    chrome.storage.sync.get(['apiProvider', 'azureApiKey', 'azureEndpoint', 'openaiApiKey', 'openaiEndpoint', 'openaiModel'], async (config) => {
      let apiKey, endpoint, model, headers;

      if (config.apiProvider === 'openai') {
        apiKey = config.openaiApiKey;
        endpoint = config.openaiEndpoint;
        model = config.openaiModel; // Retrieve the model name for OpenAI
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        };
      } else {
        apiKey = config.azureApiKey;
        endpoint = config.azureEndpoint;
        headers = {
          'Content-Type': 'application/json',
          'api-key': apiKey
        };
      }

      if (!apiKey || !endpoint) {
        console.error('API key or endpoint is not set.');
        chrome.runtime.sendMessage({ action: 'displayError', content: 'API key or endpoint is not set. Please configure them in the extension settings.' });
        return;
      }

      const requestBody = {
        messages: [{ role: 'user', content: prompt }]
      };

      // Add model to the request body for OpenAI
      if (config.apiProvider === 'openai') {
        requestBody.model = model;
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log("API response:", responseData);

        // Check if the response is an error
        if (responseData.error) {
          console.log("API error:", responseData.error);
          chrome.runtime.sendMessage({ action: 'displayError', content: `API error: ${responseData.error.message}` });
          return;
        }

        // Print the response message
        if (responseData.choices && responseData.choices.length > 0) {
          let responseMessage = responseData.choices[0].message.content;
          console.log("Response message:", responseMessage);

          // Replace newlines with HTML line breaks
          responseMessage = responseMessage.replace(/\n/g, '<br>');

          // Send the response message to the background script
          chrome.runtime.sendMessage({ action: 'openaiResponse', content: responseMessage });
        } else {
          console.log("No response message received.");
        }
      } catch (error) {
        chrome.runtime.sendMessage({ action: 'displayError', content: `Request failed: ${error.message}` });
        console.error('Request failed:', error); 
      }
    });
  }

  // Create the prompt with the collected text
  const prompt = `
The list shows the title, the artist, and the time the title was played. Do 2 steps:

Step 1: Please create a paragraph in a casual style and say that I had fun to play those great songs; use other words than I used here. Add a few emojies.
Step 2: Create a list in the following format for the titles, artist, and time:

[time] Title (artist)
[time] Title (artist)
[time] Title (artist)

Here is an example:
[12:56] Blade, DJ Kuba, Neitan, Bounce Inc.
[19:41] Coming from Paradise (Extended Mix), Cenk Basaran
[27:51] My Beat Goes (Extended Mix), Ummet Ozcan

Remember to only output the start time of the song, not the end time. DO NOT OUTPUT ANYTHING ELSE THAN THE PARAGRAPH AND THE LIST. THE LIST MUST BE SORTED BY STARTTIME

${allInnerText}
`;

  // Send the collected text to the selected API
  sendToAPI(prompt);
})();