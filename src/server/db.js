import { apply, compose, curry, map, merge, reduce, reverse, head, toPairs } from 'ramda'
import { task, waitAll } from 'folktale/concurrency/task'

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

const openAllConnections = (databases, mongoClient) =>
  waitAll(openConnections(databases, mongoClient)).run()

// initializeDatabases :: (Object, Object) -> Task -> Result
const initializeDatabases = (databases, mongoClient) =>
  task(resolver => openAllConnections(databases, mongoClient).listen({
    onRejected: error => resolver.reject(error),
    onResolved: data => resolver.resolve(defineConnections(data)),
  }))

const closeAllConnections = databases =>
  waitAll(closeConnections(databases)).run()

// disconnectDatabases :: Object -> Task -> Result
const disconnectDatabases = databases =>
  task(resolver => closeAllConnections(databases).listen({
    onRejected: error => resolver.reject(error),
    onResolved: data => resolver.resolve('Databases disconnected'),
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
