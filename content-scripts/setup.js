const STICKY_OFFSET = 100

const CLASS_VIOLATION = "violation"
const CLASS_ACTIVE_VIOLATION = "active-violation"
const CLASS_ADDITIONS = "blob-code-addition"

const ACTION_NEXT = "next"
const ACTION_PREV = "prev"

let currentStep = 0
let maxStep = 1
let activeViolator
let violators = []