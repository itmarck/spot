// @ts-check

import Container, { object, use } from 'rsdi'
import { UserController } from './app/rest/UserController.js'
import { UserRepository } from './core/users/UserRepository.js'
import { UserService } from './core/users/UserService.js'
import { RemoteUserRepository } from './data/repositories/RemoteUserRepository.js'

export function forge() {
  /**
   * @type {Container}
   */
  // @ts-ignore
  const container = new Container.default()

  container.add({
    [UserRepository.name]: object(RemoteUserRepository).construct(),
    [UserService.name]: object(UserService).construct(use(UserRepository.name)),

    /**
     * User controller
     */
    [UserController.name]: object(UserController).construct(
      use(UserService.name),
    ),
  })

  return container
}
