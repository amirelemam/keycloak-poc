'use strict'

const path = require('path')
const HTTP_STATUS = require('http-status-codes')
const RegisterUserContract = require(path.resolve(
  'src/controllers/contracts/RegisterUserContract'
))
const UserContract = require(path.resolve(
  'src/controllers/contracts/UserContract'
))
const usersService = require(path.resolve('src/services/usersService'))

module.exports = {

  resetPassword: async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    const username = req.body.username
    const newPassword = req.body.newPassword
    const newPasswordConfirmation = req.body.newPasswordConfirmation

    const user = await usersService.getUserByUsername(username)

    if (!_.isEmpty(user)) {
      await usersService.resetPassword(user.id, newPassword, newPasswordConfirmation)

      return res.status(HTTP_STATUS.OK).json('Password updated successfully.')
    }
    else
      return res.status(HTTP_STATUS.NOT_FOUND).json('User not found')
  },

  createUsers: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')

    const registerUser = RegisterUserContract.fromRequestBody(req.body)
    try {
      const model = await usersService.createUser(registerUser)
      return res.status(HTTP_STATUS.CREATED).json(UserContract.fromModel(model))
    } catch (e) {
      next(e)
    }
  },

  updateUsers: async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')

    const registerUser = RegisterUserContract.fromRequestBody(req.body)
    try {
      const model = await usersService.updateUser(registerUser)
      return res.status(HTTP_STATUS.OK).json(UserContract.fromModel(model))
    } catch (e) {
      next(e)
    }
  },

  listUsers: async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    const result = await usersService.listUsers()
    return res.status(HTTP_STATUS.OK).json(result)
  },

  getUserByUsername: async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    const username = req.params.username

    const result = await usersService.getUserByUsername(username)

    if (result) {
      return res.status(HTTP_STATUS.OK).json(result)
    } else {
      return res.status(HTTP_STATUS.NOT_FOUND).json('User not found.')
    }
  },

  deleteUser: async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')

    const userId = req.params.userId

    if (userId) {
      const result = await usersService.deleteUser(userId)

      if (result) {
        return res.status(HTTP_STATUS.OK).json('User deleted')
      } else {
        return res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .json('Could not delete user')
      }
    } else {
      return res.status(HTTP_STATUS.NOT_FOUND).json('User not found')
    }
  },

  getJobByUserId: async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    const userId = req.params.userId

    const result = await usersService.getJobByUserId(userId)

    if (result) {
      return res.status(HTTP_STATUS.OK).json(result)
    } else {
      return res.status(HTTP_STATUS.NOT_FOUND).json('User not found.')
    }
  },
}
