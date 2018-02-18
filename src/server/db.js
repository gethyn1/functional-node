import Promise from 'bluebird'
import { apply, compose, curry, map, merge, reduce, reverse, head, toPairs } from 'ramda'

// fromPairs :: (Object, [a, b]) -> Object
const fromPairs = (acc, value) => merge(acc, { [value[0]]: value[1] })

// defineConnections :: [[a, b]] -> Object
const defineConnections = reduce(fromPairs, {})

// getConnections :: Object -> [a]
const getConnections = compose(map(compose(head, reverse)), toPairs)

// closeConnection :: Object -> null
const closeConnection = client => client.close()

// closeConnections :: Object -> null
const closeConnections = compose(map(closeConnection), getConnections)

// connectDatabase :: (Object, String, String) -> Promise
const connectDatabase = curry((mongoClient, name, uri) =>
  new Promise((resolve, reject) => {
    mongoClient.connect(uri, (err, client) => {
      if (err) return reject(err)
      resolve([name, client])
    })
  }))

// openConnections :: (Object, Object) -> [String, String]
const openConnections = (databases, mongoClient) => {
  const connectClient = connectDatabase(mongoClient)
  return compose(map(apply(curry(connectClient))), toPairs)(databases)
}

// initializeDatabases :: (Object, Object) -> Promise
const initializeDatabases = (databases, mongoClient) =>
  Promise.all(openConnections(databases, mongoClient))
    .then((data) => Promise.resolve(defineConnections(data)))
    .catch(err => Promise.reject(err))

// disconnectDatabases :: Object -> Promise
const disconnectDatabases = (dbs) =>
  Promise.all(closeConnections(dbs))
    .then((data) => Promise.resolve('Databases disconnected'))
    .catch(err => Promise.reject(err))

export {
  fromPairs,
  defineConnections,
  getConnections,
  connectDatabase,
  initializeDatabases,
  closeConnection,
  disconnectDatabases,
}
