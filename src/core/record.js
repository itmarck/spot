export class Record {
  constructor({ id, name, value }) {
    this.id = id
    this.name = name
    this.value = value
  }

  toJSON() {
    return {
      name: this.name,
      value: this.value,
    }
  }

  static fromJSON(json) {
    return new Record({
      id: json['id'],
      name: json['name'],
      value: json['value'],
    })
  }
}
