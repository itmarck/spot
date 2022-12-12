import { host } from '../shared/configuration.js'
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
    this.redirectUri = redirectUri
    this.authorizedAt = authorizedAt
  }

  static fromJSON(json) {
    const hostname = host()
    const avatar = json['avatar']
    const ownerAvatar = json['owner_avatar']

    if (avatar && avatar.startsWith('/')) {
      json.avatar = `${hostname}${avatar}`
    }
    if (ownerAvatar && ownerAvatar.startsWith('/')) {
      json.owner_avatar = `${hostname}${ownerAvatar}`
    }

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
      redirectUri: json['redirect_uri'],
      authorizedAt: difference(json['authorized_at']),
    })
  }
}
