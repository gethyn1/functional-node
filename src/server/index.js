import './dotenv'

/* eslint-disable import/first */

import express from 'express'
import { MongoClient } from 'mongodb'
import { curry, map } from 'ramda'
import config from '../config'
import { initializeDatabases, disconnectDatabases } from './db'
import { applyMiddleware } from './middleware'
import createUserRoutes from '../routes/users'
// import robotsTxtRoute from '../routes/robots'

const logError = error => error.mapError(console.log)

const initializeApp = (config, app, dbs) => {
  applyMiddleware(app)
  createUserRoutes(config, dbs, app)

  app.listen(config.WEB_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${config.WEB_PORT} ${config.IS_PROD ? '(production)' :
      '(development)'}.`)
  })

  process.on('SIGINT', () =>
    disconnectDatabases(dbs).run().listen({
      onRejected: logError,
      onResolved: map(console.log),
    })
  )
}

const buildApp = curry(initializeApp)(config, express())

initializeDatabases({ userapp: config.MONGODB_URI }, MongoClient)
  .run().listen({
    onRejected: logError,
    onResolved: map(buildApp),
  })
