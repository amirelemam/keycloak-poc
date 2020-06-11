const axios = require('axios')
const qs = require('qs')
const _ = require('lodash')

module.exports = {
  getToken: async (realm, username, secret) => {

    try {
      const response = await axios({
        method: 'post',
        url: `http://localhost:8081/auth/realms/${realm}/protocol/openid-connect/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: qs.stringify({
          grant_type: 'client_credentials'
        }),
        auth: {
          username: username,
          password: secret
        }
      })

      if (!_.isEmpty(response) && response.data && response.data.access_token) {
        return response.data.access_token
      } else return null
    } catch (e) {
      throw new Error(e)
    }
  },

  createUser: async (realm, accessToken, data) => {
    try {
      const url = `http://localhost:8081/auth/admin/realms/${realm}/users`
      const response = await axios({
        method: 'post',
        url: url,
        data: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken
        }
      })

      return response.status >= 200 && response.status < 400
    } catch (e) {
      throw new Error(e)
    }
  },

  getUserIdByEmail: async (realm, email, accessToken) => {
    const response = await axios({
      method: 'get',
      url: `http://localhost:8081/auth/admin/realms/${realm}/users?email=${email}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

    if (!_.isEmpty(response.data)) {
      return response.data[0].id
    } else return null
  },

  getUserByUsername: async (realm, username, accessToken) => {
    const response = await axios({
      method: 'get',
      url: `http://localhost:8081/auth/admin/realms/${realm}/users?username=${username}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

    if (!_.isEmpty(response.data)) {
      return response.data[0]
    } else return null
  },

  delete: async (realm, userId, accessToken) => {
    const response = await axios({
      method: 'delete',
      url: `http://localhost:8081/auth/admin/realms/${realm}/users/${userId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

    return response.status >= 200 && response.status < 400
  },

  setPassword: async (realm, userId, newPassword, isTemporary, accessToken) => {
    const response = await axios({
      method: 'put',
      url: `http://localhost:8081/auth/admin/realms/${realm}/users/${userId}/reset-password`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      },
      data: {
        type: 'password',
        value: newPassword,
        temporary: isTemporary
      }
    })

    return response.status >= 200 && response.status < 400
  },

  listGroups: async (realm, accessToken) => {
    const response = await axios({
      method: 'get',
      url: `http://localhost:8081/auth/admin/realms/${realm}/groups`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

    if (response.status >= 200 && response.status < 400) {
      return response.data
    } else return null
  },

  assignGroupToUser: async (realm, userId, groupId, accessToken) => {
    const response = await axios({
      method: 'put',
      url: `http://localhost:8081/auth/admin/realms/${realm}/users/${userId}/groups/${groupId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

    return response.status >= 200 && response.status < 400
  },

  listUsers: async (realm, accessToken) => {
    const response = await axios({
      method: 'get',
      url: `http://localhost:8081/auth/admin/realms/${realm}/users`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

    if (response.status >= 200 && response.status < 400) return response.data
    else return null
  },

  update: async (realm, userId, body, accessToken) => {
    const response = await axios({
      method: 'put',
      url: `http://localhost:8081/auth/admin/realms/${realm}/users/${userId}`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

    if (!_.isEmpty(response.data)) {
      return response.data
    } else return null
  },

  getJobByUserId: async (realm, userId, accessToken) => {
    const response = await axios({
      method: 'get',
      url: `http://localhost:8081/auth/admin/realms/${realm}/users/${userId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    })

    if (!_.isEmpty(response.data)) {
      return response.data.attributes.job
    } else return null
  }
}
