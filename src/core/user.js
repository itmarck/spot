export class User {
  constructor({ email, name, avatar }) {
    this.email = email
    this.name = name
    this.avatar = avatar
  }

  static fromJSON(json) {
    return new User({
      email: json['email'],
      name: json['name'],
      avatar: json['avatar'],
    })
  }
}
