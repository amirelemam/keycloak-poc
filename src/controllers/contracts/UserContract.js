class UserContract {
  constructor(username, fullname, email, job, phone, admin) {
    this.username = username
    this.fullname = fullname
    this.email = email
    this.job = job
    this.phone = phone
    this.admin = admin
  }

  static fromModel(userModel) {
    const $ = userModel
    return new UserContract(
      $.username,
      $.fullname,
      $.email,
      $.job,
      $.phone,
      $.admin
    )
  }

  static fromRequestBody(body) {
    const $ = body
    return new UserContract(
      $.username,
      $.fullname,
      $.email,
      $.job,
      $.phone,
      $.admin
    )
  }
}

module.exports = UserContract
