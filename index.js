'use strict'

const http = require('http')
const path = require('path')
const express = require('express')
const helmet = require('helmet')()
const cors = require('cors')
const bodyParser = require('body-parser')

const Keycloak = require('keycloak-connect')
const session = require('express-session')

const usersRoutes = require(path.resolve(__dirname, 'src', 'routes', 'usersRoutes'))
const memoryStore = new session.MemoryStore()

require('dotenv').config()

const app = express()
app.set('port', 3550)
app.set('title', "Keycloak POC")

app.use(
  session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
)

const keycloak = new Keycloak({
  store: memoryStore
})

app.use(keycloak.middleware({}))

app.use(helmet)
app.use(cors())
app.use(bodyParser.json())

usersRoutes(app, keycloak)

http.createServer(app).listen(app.get('port'), () => {
  console.log(`${app.get('title')} listening on port ${app.get('port')}`)
})

module.exports = app

