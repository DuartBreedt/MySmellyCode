chrome.storage.sync.get(STORAGE_KEY_KEYWORDS, async ({ keywords }) => {

    // Clean up markup of old violations
    for (const oldViolator of violators) {
        oldViolator.classList.remove(CLASS_VIOLATION, CLASS_ACTIVE_VIOLATION)
    }

    violators = []
    currentStep = 0
    maxStep = 1

    let additions
    let additionValues
    let count = 0

    if ((keywords?.containsKeywords && keywords.containsKeywords.length > 0) || (keywords?.wordsKeywords && keywords.wordsKeywords.length > 0)) {
        additions = [...document.getElementsByClassName(CLASS_ADDITIONS)]
        additionValues = additions.map(addition => addition.textContent.trim())

        // Markup new violations
        for (let a = 0; a < additionValues.length; a++) {

            if (keywords?.containsKeywords) {

                for (const keyword of keywords.containsKeywords) {

                    if (additionValues[a].includes(keyword)) {
                        additions[a].classList.add(CLASS_VIOLATION)
                        violators.push(additions[a])
                        count++
                        break
                    }
                }
            }

            if (keywords?.wordsKeywords) {

                for (const keyword of keywords.wordsKeywords) {

                    const regex = new RegExp(`(^|[^a-zA-Z])+?(${keyword})+([^a-zA-Z]|$)+?`)

                    if (additionValues[a].search(regex) > -1) {
                        additions[a].classList.add(CLASS_VIOLATION)
                        violators.push(additions[a])
                        count++
                        break
                    }
                }
            }
        }

        maxStep = count

        // Send number of violations to background service worker to update the badge
        chrome.runtime.sendMessage({ badge: count })
    }
})