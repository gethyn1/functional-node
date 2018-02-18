import './dotenv'

/* eslint-disable import/first */

import express from 'express'
import { MongoClient } from 'mongodb'
import { curry } from 'ramda'

import config from '../config'
import { initializeDatabases, disconnectDatabases } from './db'
import { applyMiddleware } from './middleware'
import userRoutes from '../routes/users'
// import robotsTxtRoute from '../routes/robots'

const app = express()

const initializeApp = (app, dbs) => {
  applyMiddleware(app)
  userRoutes(app, dbs, config)

  app.listen(config.WEB_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${config.WEB_PORT} ${config.IS_PROD ? '(production)' :
      '(development)'}.`)
  })

  process.on('SIGINT', () =>
    disconnectDatabases(dbs).run().listen({
      onRejected: (error) => error.map(console.log),
      onResolved: (data) => data.map(console.log),
    })
  )
}

initializeDatabases({ userapp: config.MONGODB_URI }, MongoClient)
  .run().listen({
    onRejected: (error) => error.map(console.log),
    onResolved: (data) => data.map(curry(initializeApp)(app)),
  })
