
const textBox = document.getElementById("keywordTextBox");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const currentStepField = document.getElementById("currentStep");
const maxStepField = document.getElementById("maxStep");

let hasConnected = false

// Update text input area with currently saved keywords
chrome.storage.sync.get("keywords", ({ keywords }) => {
    if (keywords) {
        textBox.value = keywords.join(", ")
    }
});

// If the user inputs a new keyword
textBox.addEventListener('input', () => {
    const keywords = textBox.value.split(/\s*(?:;|,)\s*/).filter(n => n).map(n => n.trim())

    if (keywords && keywords.length > 0) {
        chrome.storage.sync.set({ "keywords": keywords });
    } else {
        chrome.storage.sync.clear()
    }

    // Connect the popup to be able to detect whether the popup has been dismissed
    if (!hasConnected) {
        chrome.runtime.connect({ name: "popup" });
        hasConnected = true
    }
}, false);

// On next clicked, send a message to content scripts
nextButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { "action": "next" })
    });
})

// On prev clicked, send a message to content scripts
prevButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { "action": "prev" })
    });
})

// If a message is received from a content script with current step and next step in then update the UI to show it
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request?.currentStep && request?.maxStep) {
        sendResponse({ status: 'ok' });

        currentStepField.innerHTML = request.currentStep
        maxStepField.innerHTML = request.maxStep
    }
});