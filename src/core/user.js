export class User {
  constructor({ id, email, name, avatar }) {
    this.id = id
    this.email = email
    this.name = name
    this.avatar = avatar
  }

  toJSON() {
    return {
      email: this.email,
      name: this.name,
      avatar: this.avatar,
    }
  }

  static fromJSON(json) {
    return new User({
      id: json['id'],
      email: json['email'],
      name: json['name'],
      avatar: json['avatar'],
    })
  }
}
