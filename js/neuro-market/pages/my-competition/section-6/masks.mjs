
// 00:00,0
export function skiingMask(e) {
    if (e.inputType === "insertText") {
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ',', '.'];
        const separators = [':', ',', '.'];

        if (!numbers.includes(e.data) && !separators.includes(e.data)) {
            e.preventDefault()
        }
        if (e.target.value.length >=7 && e.target.selectionStart===e.target.selectionEnd) {
            e.preventDefault()
        }
        if (e.data == '.') {
            e.target.value += ','
            e.preventDefault()
        }
        if (e.target.value.length === 1) {
            e.target.value += e.data + ':'
            e.preventDefault()
        }
        if (e.target.value.length === 4) {
            e.target.value += e.data + ','
            e.preventDefault()
        }
    }
}

// 00,0
export function sprintMask(e) {
    if (e.inputType === "insertText") {
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ',', '.'];
        const separators = [',', '.'];

        if (!numbers.includes(e.data) && !separators.includes(e.data)) {
            e.preventDefault()
        }

        if (e.target.value.length >=4 && e.target.selectionStart === e.target.selectionEnd) {
            e.preventDefault()
        }

        if (e.data == '.') {
            e.target.value += ','
            e.preventDefault()
        }

        if (e.target.value.length === 1) {
            e.target.value += e.data + ','
            e.preventDefault()
        }
    }
}

// 0:00,0
export function swimmingMask(e) {
    if (e.inputType === "insertText") {
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ',', '.'];
        const separators = [':', ',', '.'];

        if (!numbers.includes(e.data) && !separators.includes(e.data)) {
            e.preventDefault()
            return
        }

        if (e.target.value.length >=6 && e.target.selectionStart===e.target.selectionEnd) {
            e.preventDefault()
            return
        }

        if (e.data == '.') {
            e.target.value += ','
            e.preventDefault()
            return
        }

        if (e.target.value.length === 0 || e.target.value.length === 6) {
            e.target.value = e.data + ':'
            e.preventDefault()
            return
        }

        if (e.target.value.length === 3) {
            e.target.value += e.data + ','
            e.preventDefault()
        }
    }
}

// 000
export function pushUpMask(e) {
    if (e.inputType === "insertText") {
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if (!numbers.includes(e.data)) {
            e.preventDefault()
        }
        if (e.target.value.length >=3 && e.target.selectionStart===e.target.selectionEnd) {
            e.preventDefault()
        }
    }
}

// 000
export function shootingMask(e) {
    return pushUpMask(e)
}

// 000
export function pullUpMask(e) {
    return pushUpMask(e)
}

// 00,0
export function throwingMask(e) {
    if (e.inputType === "insertText") {
        const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ',', '.'];
        const separators = [',', '.'];

        if (!numbers.includes(e.data) && !separators.includes(e.data)) {
            e.preventDefault()
        }

        if (e.target.value.length >=5 && e.target.selectionStart === e.target.selectionEnd) {
            e.preventDefault()
        }

        if (e.data == '.') {
            e.target.value += ','
            e.preventDefault()
        }

        if (e.target.value.length === 1) {
            e.target.value += e.data + ','
            e.preventDefault()
        }
    }
    }

// 00:00,0
export function runningMask(e) {
    return skiingMask(e)
}

// 00:00,0
export function rollerSkiingMask(e) {
    return skiingMask(e)
}

// 000
export function jumpingMask(e) {
    return pushUpMask(e)
}