import './dotenv'

/* eslint-disable import/first */

import express from 'express'
import { MongoClient } from 'mongodb'
import { __, curry, map } from 'ramda'
import { task } from 'folktale/concurrency/task'
import config from '../config'
import { initializeDatabases, disconnectDatabases } from './db'
import { applyMiddleware } from './middleware'
import userRoutes from '../routes/users'
// import robotsTxtRoute from '../routes/robots'

const { WEB_PORT, IS_PROD } = config

const logStatus = console.log

const setupRoutes = curry((config, dbs, app) => {
  userRoutes(config, dbs, app)
  return app
})

const applyRoutes = setupRoutes(config, __, express())

const listen = curry((port, isProd, app) =>
  task(resolver => {
    app.listen(port, () => {
      resolver.resolve(`Server running on port ${port} ${isProd ? '(production)' : '(development)'}.`)
    })
  })
)

const runApp = app =>
  app.run().listen({
    onRejected: logStatus,
    onResolved: logStatus,
  })

const runInitializeDatabases = initializeDatabases({
  userapp: config.MONGODB_URI,
}, MongoClient).run()

runInitializeDatabases
  .future()
  .mapRejected(logStatus)
  .map(applyRoutes)
  .map(applyMiddleware)
  .map(listen(WEB_PORT, IS_PROD))
  .map(runApp)
