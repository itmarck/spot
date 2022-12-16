export class Session {
  constructor({ code, userId, verifier, createdAt }) {
    this.code = code
    this.userId = userId
    this.verifier = verifier
    this.createdAt = createdAt
  }

  static fromJSON(json) {
    return new Session({
      code: json['code'],
      userId: json['user'],
      verifier: json['code_verifier'],
      createdAt: json['created_at'],
    })
  }
}
