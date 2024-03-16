// @ts-check

export class Application {
  constructor({
    id,
    owner,
    slug,
    name,
    description,
    avatar,
    clientId,
    clientSecret,
    redirectUri,
    authorizedAt,
  }) {
    this.id = id
    this.owner = owner
    this.slug = slug
    this.name = name
    this.description = description
    this.avatar = avatar
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.redirectUri = redirectUri
    this.authorizedAt = authorizedAt
  }
}
