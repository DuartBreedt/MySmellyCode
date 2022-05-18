chrome.storage.sync.get("keywords", async ({ keywords }) => {

    // Clean up markup of old violations
    for (const oldViolator of violators) {
        oldViolator.classList.remove(CLASS_VIOLATION, CLASS_ACTIVE_VIOLATION);
    }
    
    violators = []
    currentStep = 0
    maxStep = 1

    if (keywords) {
        const additions = [...document.getElementsByClassName("blob-code-addition")];
        const additionValues = additions.map(addition => addition.textContent.trim())

        let count = 0

        // Markup new violations
        for (let a = 0; a < additionValues.length; a++) {
            for (const keyword of keywords) {
                if (additionValues[a].includes(keyword)) {
                    additions[a].classList.add(CLASS_VIOLATION);
                    violators.push(additions[a])
                    count++
                    break;
                }
            }
        }

        maxStep = count

        // Send number of violations to background service worker to update the badge
        chrome.runtime.sendMessage({ badge: count })
    }
});