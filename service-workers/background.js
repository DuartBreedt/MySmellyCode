const dyanmicFetchUrls = [
    'https://github.com/*/diffs?*&bytes=*lines=*&pull_number=*&start_entry=*',
    'https://dev.azure.com/*/_apis/Contribution/HierarchyQuery/project/*',
]

const GITHUB_VERSION_CONTROL_PROVIDER = /https:\/\/.*github\.com\/.*\/pull\/.*\/files.*/
const AZURE_VERSION_CONTROL_PROVIDER = /https:\/\/dev\.azure\.com\/.*\/pullrequest\/.*=files.*/

const refreshFiles = ["content-scripts/render.js"]

const baseSetupFiles = [
    "constants.js",
    "content-scripts/setup.js",
    "content-scripts/step-through.js",
    ...refreshFiles
]

const githubSetupFiles = [
    "github-constants.js",
    ...baseSetupFiles
]

const azureSetupFiles = [
    "azure-constants.js",
    ...baseSetupFiles
]

if (!chrome.runtime.onMessage.hasListeners()) {
    chrome.runtime.onMessage.addListener(onMessageCallback)
}

if (!chrome.webRequest.onCompleted.hasListeners()) {
    chrome.webRequest.onCompleted.addListener(onCompletedCallback, { urls: dyanmicFetchUrls })
}

if (!chrome.runtime.onConnect.hasListeners()) {
    chrome.runtime.onConnect.addListener(onConnectCallback)
}

if (!chrome.webNavigation.onHistoryStateUpdated.hasListeners()) {
    chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdatedCallback)
}

// Violation count for badge indicator from render.js
async function onMessageCallback(request, sender, sendResponse) {
    if (request?.badge == 0 || request?.badge) {
        sendResponse({ status: 'ok' })
        chrome.action.setBadgeText({ tabId: sender.tab.id, text: `${request.badge}` })
    }
}

// On network request for more data completed
async function onCompletedCallback(details) {
    refreshPage(refreshFiles)
}

// If the popup is dismissed
async function onConnectCallback(port) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (tab) {
        const isSupportedUrl = tab.url.search(GITHUB_VERSION_CONTROL_PROVIDER) > -1 || tab.url.search(AZURE_VERSION_CONTROL_PROVIDER) > -1

        if (isSupportedUrl && port.name === 'popup' && !port.onDisconnect.hasListeners()) {
            port.onDisconnect.addListener(async () => refreshPage(refreshFiles))
        }
    }
}

async function onHistoryStateUpdatedCallback(details) {
    setupPage(details)
}

async function setupPage(details) {
    if (details.url.search(GITHUB_VERSION_CONTROL_PROVIDER) > -1) {
        refreshPage(githubSetupFiles, details.tabId)
    } else if (details.url.search(AZURE_VERSION_CONTROL_PROVIDER) > -1) {
        refreshPage(azureSetupFiles, details.tabId)
    } else {
        chrome.action.setBadgeText({ tabId: details.tabId, text: '' })
        return
    }
}

// Refresh UI with markup
async function refreshPage(files, tabId = undefined) {
    if (!tabId) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

        if (tab) {
            tabId = tab.id
        }
    }

    if (tabId) {
        chrome.scripting.executeScript({
            target: { tabId },
            files
        })
    }
}