import { getUser } from '../data/user.js'

/**
 * Insert authenticated user object into render templates
 */
export async function withUser(request, response, next) {
  const loggedIn = response.locals.loggedIn
  const userId = request.userId

  if (loggedIn) {
    response.locals.user = await getUser(userId)
  }

  next()
}
