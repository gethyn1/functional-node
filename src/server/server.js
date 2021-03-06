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

// setupRoutes :: (Object, Object, Object) -> Object
const setupRoutes = curry((config, dbs, app) => {
  userRoutes(config, dbs, app)
  return app
})

const applyRoutes = setupRoutes(config, __, express())

// setupRoutes :: (String, Boolean, Object) -> Task
const listenOnPort = curry((port, isProd, app) =>
  task(resolver => {
    app.listen(port, () => {
      resolver.resolve(`Server running on port ${port} ${isProd ? '(production)' : '(development)'}.`)
    })
  })
)

const setupServer = listenOnPort(WEB_PORT, IS_PROD)

const runInitializeDatabases = initializeDatabases({
  userapp: config.MONGODB_URI,
}, MongoClient).run()

const runListenOnPort = appTask =>
  appTask.run().listen({
    onRejected: logStatus,
    onResolved: logStatus,
  })

export {
  listenOnPort,
  setupServer,
  logStatus,
  runInitializeDatabases,
  applyRoutes,
  applyMiddleware,
  runListenOnPort,
}
