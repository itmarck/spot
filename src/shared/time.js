import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)

const expirationTime = 60
const timeToSendCode = 2

function now() {
  return dayjs().utc()
}

/**
 * Return the current day but one year later.
 * @returns {Date}
 */
export function getNextYear() {
  return now().add(1, 'year').toDate()
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

export function difference(date) {
  if (!date) return

  const inDays = now().diff(dayjs(date).utc(true), 'days')
  const inMonths = now().diff(dayjs(date).utc(true), 'months')
  if (inDays < 7) return `Autorizado hace menos de una semana`
  if (inDays < 30) return `Autorizado en el último mes`
  if (inDays < 365) return `Autorizado en los últimos ${inMonths} meses`
  return `Autorizado hace más de un año`
}
