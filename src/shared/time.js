import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)

const expirationTime = 15
const timeToSendCode = 2

function now() {
  return dayjs().utc()
}

/**
 * Determines if the given date has expired from time of code generation.
 *
 * @param {string} date Loaded from the database.
 * @returns {boolean}
 */
export function isExpired(date) {
  if (!date) return true
  return dayjs(date).utc(true).add(expirationTime, 'minutes').isBefore(now())
}

export function canSendCode(date) {
  if (!date) return true
  return dayjs(date).utc(true).add(timeToSendCode, 'minutes').isBefore(now())
}
