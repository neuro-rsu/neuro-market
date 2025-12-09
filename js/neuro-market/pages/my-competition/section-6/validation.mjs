export function isShootingValid(value) {
    return /\d+/.test(value)
}

export function isPullUpValid(value) {
    return /\d+/.test(value)
}

export function isPushUpValid(value) {
    return /\d+/.test(value)
}

export function isSwimmingValid(value) {
    return /\d:\d\d.\d/.test(value)
}

export function isThrowingValid(value) {
    return /\d{2,3},\d\d/.test(value)
}

export function isSprintValid(value) {
    return /\d\d,\d/.test(value)
}

export function isRunningValid(value) {
    return /\d\d:\d\d,\d/.test(value)
}

export function isSkiingValid(value) {
    return /\d\d:\d\d,\d/.test(value)
}

export function isRollerSkiingValid(value) {
    return /\d\d:\d\d,\d/.test(value)
}

export function isJumpingValid(value) {
    return /\d{1,3}/.test(value)
}