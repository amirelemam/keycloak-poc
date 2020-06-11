const path = require('path')
const _ = require("lodash")

const keycloakService = require(path.resolve('src/services/keycloakService'))

const realm = process.env.KEYCLOAK_REALM

module.exports = {

  getAccessToken: () => {
    const username = process.env.KEYCLOAK_CLIENT_USERNAME
    const secret = process.env.KEYCLOAK_CLIENT_PASSWORD

    return keycloakService.getToken(realm, username, secret)
  },

  createUser: async registerUser => {
    const accessToken = await module.exports.getAccessToken()

    if (registerUser.password !== registerUser.passwordConfirmation) {
      throw new Error("Password mismatch:", registerUser.password, '!==', registerUser.passwordConfirmation)
    }

    const [firstName, lastName] = registerUser.fullname.split(' ')

    const userData = {
      enabled: true,
      email: registerUser.email,
      username: registerUser.username,
      firstName: firstName,
      lastName: lastName,
      attributes: {
        job: registerUser.job,
        phone: registerUser.phone,
      }
    }

    const hasCreated = await keycloakService.createUser(
      realm,
      accessToken,
      userData
    )

    if (hasCreated) {
      const userId = await keycloakService.getUserIdByEmail(
        realm,
        userData.email,
        accessToken
      )

      if (userId) {
        const isTemporary = true

        const hasSetPassword = await keycloakService.setPassword(
          realm,
          userId,
          registerUser.password,
          isTemporary,
          accessToken
        )

        if (hasSetPassword) {
          const groups = await keycloakService.listGroups(realm, accessToken)

          let groupId
          for (let group of groups) {
            if (group.name === 'Supervisores') {
              groupId = group.id
              break
            }
          }

          const groupAssigned = await keycloakService.assignGroupToUser(
            realm,
            userId,
            groupId,
            accessToken
          )

          if (groupAssigned) return userData
          else return {}
        } else throw new Error()
      } else throw new Error()
    } else throw new Error()
  },

  listUsers: async () => {
    const accessToken = await module.exports.getAccessToken()

    if (accessToken) return keycloakService.listUsers(realm, accessToken)
    else return null
  },

  updateUser: async updateUser => {
    const accessToken = await module.exports.getAccessToken()

    const user = await keycloakService.getUserByUsername(
      realm,
      updateUser.username,
      accessToken
    )

    if (_.isEmpty(user)) throw new Error("user not found")

    const [firstName, lastName] = updateUser.fullname.split(' ')

    const userData = {
      enabled: true,
      email: updateUser.email,
      username: updateUser.username,
      firstName: firstName,
      lastName: lastName,
      attributes: {
        job: updateUser.job,
        phone: updateUser.phone,
      }
    }

    await keycloakService.update(realm, user.id, userData, accessToken)

    return userData
  },

  getUserByUsername: async username => {
    const accessToken = await module.exports.getAccessToken()

    return keycloakService.getUserByUsername(realm, username, accessToken)
  },

  deleteUser: async userId => {
    const accessToken = await module.exports.getAccessToken()

    return keycloakService.delete(realm, userId, accessToken)
  },

  resetPassword: async (userId, newPassword, newPasswordConfirmation) => {
    if (!newPassword || !newPasswordConfirmation) throw new Error("no password")
    if (newPassword !== newPasswordConfirmation) {
      throw new Error("password mismatch")
    }

    const accessToken = await module.exports.getAccessToken()

    return keycloakService.setPassword(
      realm,
      userId,
      newPassword,
      false,
      accessToken
    )
  },

  getJobByUserId: async userId => {
    const accessToken = await module.exports.getAccessToken()

    return keycloakService.getJobByUserId(realm, userId, accessToken)
  }
}
