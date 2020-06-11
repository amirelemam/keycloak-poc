'use strict'

module.exports = (app, keycloak) => {
  const path = require('path')
  const { Validator } = require('express-json-validator-middleware')
  const validate = new Validator().validate
  const loginSchema = require(path.resolve('src/jsonSchemas/user/loginSchema'))
  const RegisterUserContract = require(path.resolve(
    'src/controllers/contracts/RegisterUserContract'
  ))
  const resetPasswordSchema = require(path.resolve(
    'src/jsonSchemas/user/resetPasswordSchema'
  ))

  const controller = require(path.resolve('src/controllers/usersController'))
  const router = require('express').Router()

  router.post(
    '/api/password/reset',
    validate({ body: resetPasswordSchema }),
    // keycloak.protect(),
    controller.resetPassword
  )

  router.post(
    '/api/users',
    validate({ body: RegisterUserContract.validationSchema }),
    // keycloak.protect(),
    controller.createUsers
  )

  router.put(
    '/api/users',
    validate({ body: RegisterUserContract.validationSchemaForUpdate }),
    // keycloak.protect(),
    controller.updateUsers
  )

  router.get('/api/users',
    // keycloak.protect(),
    controller.listUsers)

  router.get(
    '/api/users/:username',
    // keycloak.protect(),
    controller.getUserByUsername
  )

  router.delete('/api/users/:userId',
    //  keycloak.protect(),
    controller.deleteUser)

  router.get(
    '/api/users/:userId/job',
    // keycloak.protect(),
    controller.getJobByUserId
  )

  app.use(router)
}
