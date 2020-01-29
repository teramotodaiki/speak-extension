const startButton = document.getElementsByClassName('activation-button')[0];
const stopButton = document.getElementsByClassName('deactivation-button')[0];
const languageSelect = document.getElementsByClassName('language-select')[0];
const errorMessage = document.getElementsByClassName('error-message')[0];

const sendMessage = message => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
};

languageSelect.addEventListener('change', event => {
  sendMessage({ method: 'lang', data: event.target.value });
  // Save configs into local storage
  chrome.storage.local.set({ lang: event.target.value });
});

startButton.addEventListener('click', () => sendMessage({ method: 'start' }));

stopButton.addEventListener('click', () => sendMessage({ method: 'stop' }));

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.error) {
    errorMessage.textContent = request.error;
  }
});

// Load current configs from local storage
chrome.storage.local.get(['lang'], function(result) {
  if (result.lang) {
    languageSelect.value = result.lang;
    sendMessage({ method: 'lang', data: result.lang });
  }
});
