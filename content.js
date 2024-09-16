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

  // Function to send the collected text to Azure OpenAI
  async function sendToAzureOpenAI(prompt) {
    // Retrieve the API key and endpoint from storage
    chrome.storage.sync.get(['apiKey', 'endpoint'], async (config) => {
      const apiKey = config.apiKey;
      const endpoint = config.endpoint;

      if (!apiKey || !endpoint) {
        console.error('API key or endpoint is not set.');
        chrome.runtime.sendMessage({ action: 'displayError', content: 'API key or endpoint is not set. Please configure them in the extension settings.' });
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const responseData = await response.json();
      console.log("Azure OpenAI response:", responseData);

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
    });
  }

  // Create the prompt with the collected text
  const prompt = `
The list shows the title, the artist, and the time the title was played. Do 2 steps:

Step 1: Please create a paragraph in a casual style and say that it was super fun to mix those great songs together in my home studio; use other words than I used here. Also at my LinkedIn account to reach out to me linkedin.com/in/svenmalvik/. Add a few emojies.
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

  // Send the collected text to Azure OpenAI
  sendToAzureOpenAI(prompt);
})();