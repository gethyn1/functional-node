import {
  logStatus,
  runInitializeDatabases,
  applyRoutes,
  applyMiddleware,
  setupServer,
  runListenOnPort,
} from './server'

runInitializeDatabases
  .future()
  .mapRejected(logStatus)
  .map(applyRoutes)
  .map(applyMiddleware)
  .map(setupServer)
  .map(runListenOnPort)
