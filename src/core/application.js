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
  }) {
    this.id = id
    this.owner = owner
    this.slug = slug
    this.name = name
    this.description = description
    this.avatar = avatar
    this.clientId = clientId
    this.redirectUri = redirectUri
  }

  static fromJSON(json) {
    return new Application({
      id: json['id'],
      owner: json['owner'],
      slug: json['slug'],
      name: json['name'],
      description: json['description'],
      avatar: json['avatar'],
      clientId: json['client_id'],
      redirectUri: json['redirect_uri'],
    })
  }
}
