VERSION_CONTROL_PROVIDER = /https:\/\/dev\.azure\.com\/.*\/pullrequest\/.*=files.*/

STICKY_OFFSET = 60

CLASS_ADDITIONS = 'added'

// Rethink this to use click events instead perhaps
CLASS_VIOLATOR_ACCORDION_OPEN = 'open'
CLASS_VIOLATOR_ACCORDION_DETAILS = 'Details--on'
SELECTOR_VIOLATOR_ACCORDION = '.file.js-file.js-details-container.js-targetable-element.Details.show-inline-notes.js-tagsearch-file'

function getScrollContainer() {
    return document.getElementsByClassName("repos-changes-viewer")[0]
}

function showViolator(activeViolator) {
    /* NOOP */
}