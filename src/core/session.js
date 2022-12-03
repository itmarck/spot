export class Session {
  constructor({ userId, code, token, createdAt }) {
    this.userId = userId
    this.code = code
    this.token = token
    this.createdAt = createdAt
  }

  static fromJSON(json) {
    return new Session({
      userId: json['user'],
      code: json['code'],
      token: json['token'],
      createdAt: json['created_at'],
    })
  }
}
