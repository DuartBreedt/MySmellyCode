VERSION_CONTROL_PROVIDER = /https:\/\/.*github\.com\/.*\/pull\/.*\/files.*/

STICKY_OFFSET = 100

CLASS_ADDITIONS = 'blob-code-addition'
CLASS_VIOLATOR_ACCORDION_OPEN = 'open'
CLASS_VIOLATOR_ACCORDION_DETAILS = 'Details--on'
SELECTOR_VIOLATOR_ACCORDION = '.file.js-file.js-details-container.js-targetable-element.Details.show-inline-notes.js-tagsearch-file'

function getScrollContainer() {
    return window
}

function showViolator(activeViolator) {
    const violatorAccordion = activeViolator.closest(SELECTOR_VIOLATOR_ACCORDION)
    if (violatorAccordion && !violatorAccordion.classList.contains(CLASS_VIOLATOR_ACCORDION_OPEN)) {
        violatorAccordion.classList.add(CLASS_VIOLATOR_ACCORDION_OPEN, CLASS_VIOLATOR_ACCORDION_DETAILS)
    }
}