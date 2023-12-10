import { difference } from '../shared/time.js'

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

  static fromJSON(json) {
    return new Application({
      id: json['id'],
      owner: {
        id: json['owner'],
        name: json['owner_name'],
        email: json['owner_email'],
        avatar: json['owner_avatar'],
      },
      slug: json['slug'],
      name: json['name'],
      description: json['description'],
      avatar: json['avatar'],
      clientId: json['client_id'],
      clientSecret: json['client_secret'],
      redirectUri: json['redirect_uri'],
      authorizedAt: difference(json['authorized_at']),
    })
  }
}
