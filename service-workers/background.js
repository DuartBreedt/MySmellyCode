const lazyLoadUrl = "https://github.com/*/diffs?*&bytes=*lines=*&pull_number=*&start_entry=*"

if (!chrome.runtime.onMessage.hasListeners()) {
    chrome.runtime.onMessage.addListener(onMessageCallback);
}

if (!chrome.webRequest.onCompleted.hasListeners()) {
    chrome.webRequest.onCompleted.addListener(onCompletedCallback, { urls: [lazyLoadUrl] })
}

if (!chrome.runtime.onConnect.hasListeners()) {
    chrome.runtime.onConnect.addListener(onConnectCallback);
}

// Violation count for badge indicator from pull-request.js
async function onMessageCallback(request, sender, sendResponse) {
    if (request?.badge == 0 || request?.badge) {
        sendResponse({ status: 'ok' });

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.action.setBadgeText({ tabId: tab.id, text: `${request.badge}` })
    }
}

// On network request for more data completed
async function onCompletedCallback(details) {
    refreshPage()
}

// If the popup is dismissed
async function onConnectCallback(port) {
    if (port.name === "popup" && !port.onDisconnect.hasListeners()) {
        port.onDisconnect.addListener(async () => refreshPage());
    }
}

// Refresh UI with markup
async function refreshPage() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-scripts/pull-request.js']
    });
}