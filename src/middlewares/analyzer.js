import { hasAccess } from '../data/access.js'

/**
 * @param {object} options
 * @param {string} options.context Verify the context in the request token
 * @param {boolean} options.access Verify the access to the content
 * @param {boolean} options.session Returns to login page if user is not authenticated
 */
export function analyzer({ context, access, session } = {}) {
  return async function (request, response, next) {
    const here = request.originalUrl
    const userId = request.userId
    const payload = request.payload
    const loggedIn = response.locals.loggedIn
    const tokenContext = payload && payload.context
    const applicationId = payload && payload.aid

    if (context && context !== tokenContext) {
      return response.status(403).send()
    }

    if (session && !loggedIn) {
      return response.redirect(`/login?return_to=${here}`)
    }

    if (access) {
      const granted = await hasAccess({ userId, applicationId })

      if (!granted) {
        return response.status(403).send({
          message: 'Requires authorization from the user',
        })
      }
    }

    next()
  }
}
