
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({ status: 'ok' });

    if (activeViolator) {
        // Remove styles for the old active violator
        activeViolator.classList.remove(CLASS_ACTIVE_VIOLATION);
    }

    if (request.action == ACTION_NEXT) {
        if (currentStep < violators.length) {
            activeViolator = violators[currentStep]
            currentStep++
        } else { // Roll over to first violator
            currentStep = 1
            activeViolator = violators[0]
        }
    } else if (request.action == ACTION_PREV) {
        if (currentStep - 1 > 0) {
            activeViolator = violators[currentStep - 2]
            currentStep--
        } else { // Roll over to last violator
            currentStep = maxStep
            activeViolator = violators[currentStep - 1]
        }
    }

    if (activeViolator) {

        const scrollOffset = getScrollOffset(activeViolator)
        window.scrollTo(0, scrollOffset - STICKY_OFFSET <= 0 ? 0 : scrollOffset - STICKY_OFFSET);

        // Add relevant style for the active violator
        activeViolator.classList.add(CLASS_ACTIVE_VIOLATION);

        // Send the current step and max step to the UI
        chrome.runtime.sendMessage({ currentStep, maxStep })
    }

    return true
});

/**
 * Recursively calculate the scroll offset of an element which can be deeply nested.
 * 
 * @param {HTMLElement} elem The element we want to scroll to
 * @returns The scroll offset to the element
 */
function getScrollOffset(elem) {
    return elem.offsetParent ? elem.offsetTop + getScrollOffset(elem.offsetParent) : elem.offsetTop;
}