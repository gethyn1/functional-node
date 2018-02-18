import { apply, compose, curry, map, merge, reduce, reverse, head, toPairs } from 'ramda'
import { task, waitAll } from 'folktale/concurrency/task'
import Result from 'folktale/result'

// fromPairs :: (Object, [a, b]) -> Object
const fromPairs = (acc, value) => merge(acc, { [value[0]]: value[1] })

// defineConnections :: [[a, b]] -> Object
const defineConnections = reduce(fromPairs, {})

// getConnections :: Object -> [a]
const getConnections = compose(map(compose(head, reverse)), toPairs)

// closeConnection :: Object -> Task
const closeConnection = client =>
  task(resolver => {
    client.close()
    resolver.resolve()
  })

// closeConnections :: Object -> null
const closeConnections = compose(map(closeConnection), getConnections)

// connectDatabase :: (Object, String, String) -> Task
const connectDatabase = curry((mongoClient, name, uri) =>
  task(resolver => {
    mongoClient.connect(uri, (err, client) => {
      if (err) return resolver.reject(err)
      resolver.resolve([name, client])
    })
  }))

// openConnections :: (Object, Object) -> [String, String]
const openConnections = (databases, mongoClient) => {
  const connectClient = connectDatabase(mongoClient)
  return compose(map(apply(curry(connectClient))), toPairs)(databases)
}

// initializeDatabases :: (Object, Object) -> Task -> Result
const initializeDatabases = (databases, mongoClient) =>
  task(resolver => waitAll(openConnections(databases, mongoClient)).run().listen({
    onRejected: (error) => resolver.reject(Result.Error(error)),
    onResolved: (data) => resolver.resolve(Result.Ok(defineConnections(data))),
  }))

// disconnectDatabases :: Object -> Task -> Result
const disconnectDatabases = (dbs) =>
  task(resolver => waitAll(closeConnections(dbs)).run().listen({
    onRejected: (error) => resolver.reject(Result.Error(error)),
    onResolved: (data) => resolver.resolve(Result.Ok('Databases disconnected')),
  }))

export {
  fromPairs,
  defineConnections,
  getConnections,
  connectDatabase,
  initializeDatabases,
  closeConnection,
  disconnectDatabases,
}
