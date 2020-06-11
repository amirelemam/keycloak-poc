class RegisterUserContract {
  constructor(
    username,
    fullname,
    email,
    job,
    phone,
    password,
    passwordConfirmation,
    admin
  ) {
    this._username = username
    this._fullname = fullname
    this._email = email
    this._job = job
    this._phone = phone
    this._password = password
    this._passwordConfirmation = passwordConfirmation
    this._admin = admin
    Object.freeze(this)
  }

  get username() {
    return this._username
  }

  get fullname() {
    return this._fullname
  }

  get email() {
    return this._email
  }

  get job() {
    return this._job
  }

  get phone() {
    return this._phone
  }

  get password() {
    return this._password
  }

  get passwordConfirmation() {
    return this._passwordConfirmation
  }

  get admin() {
    return this._admin
  }

  static fromRequestBody(body) {
    const $ = body
    return new RegisterUserContract(
      $.username,
      $.fullname,
      $.email,
      $.job,
      $.phone,
      $.password,
      $.passwordConfirmation,
      $.admin,
    )
  }

  static get validationSchema() {
    return {
      type: 'object',
      required: [
        'username',
        'fullname',
        'email',
        'job',
        'phone',
        'password',
        'passwordConfirmation',
        'admin'
      ],
      properties: {
        username: {
          type: 'string'
        },
        fullname: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        job: {
          type: 'string'
        },
        phone: {
          type: 'string'
        },
        password: {
          type: 'string'
        },
        passwordConfirmation: {
          type: 'string'
        },
        admin: {
          type: 'boolean'
        }
      }
    }
  }

  static get validationSchemaForUpdate() {
    return {
      type: 'object',
      required: ['username', 'fullname', 'email', 'job', 'phone', 'admin'],
      properties: {
        username: {
          type: 'string'
        },
        fullname: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        job: {
          type: 'string'
        },
        phone: {
          type: 'string'
        },
        password: {
          type: 'string'
        },
        passwordConfirmation: {
          type: 'string'
        },
        admin: {
          type: 'boolean'
        }
      }
    }
  }
}

module.exports = RegisterUserContract
