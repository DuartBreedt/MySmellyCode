chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({ status: 'ok' })

    if (activeViolator) {
        // Remove styles for the old active violator
        activeViolator.classList.remove(CLASS_ACTIVE_VIOLATION)
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

        // FIXME: Do this better
        const scrollContainer = VERSION_CONTROL_PROVIDER == "AZURE" ? document.getElementsByClassName("repos-changes-viewer")[0] : window

        // FIXME: Do this better
        if (VERSION_CONTROL_PROVIDER == "GITHUB") {
            const violatorAccordion = activeViolator.closest(SELECTOR_VIOLATOR_ACCORDION)
            if (violatorAccordion && !violatorAccordion.classList.contains(CLASS_VIOLATOR_ACCORDION_OPEN)) {
                violatorAccordion.classList.add(CLASS_VIOLATOR_ACCORDION_OPEN, CLASS_VIOLATOR_ACCORDION_DETAILS)
            }
        }

        const scrollOffset = getScrollOffset(activeViolator)
        scrollContainer.scrollTo(0, scrollOffset - STICKY_OFFSET <= 0 ? 0 : scrollOffset - STICKY_OFFSET)

        // Add relevant style for the active violator
        activeViolator.classList.add(CLASS_ACTIVE_VIOLATION)

        // Send the current step and max step to the UI
        chrome.runtime.sendMessage({ currentStep, maxStep })
    }

    return true
})

/**
 * Recursively calculate the scroll offset of an element which can be deeply nested.
 * 
 * @param {HTMLElement} elem The element we want to scroll to
 * @returns The scroll offset to the element
 */
function getScrollOffset(elem) {
    return elem.offsetParent ? elem.offsetTop + getScrollOffset(elem.offsetParent) : elem.offsetTop
}