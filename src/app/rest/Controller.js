// @ts-check

export class Controller {
  constructor() {
    const prototype = Object.getPrototypeOf(this)
    const properties = Object.getOwnPropertyNames(prototype)

    for (const property of properties) {
      if (property === 'constructor') continue
      this[property] = this[property].bind(this)
    }
  }
}
