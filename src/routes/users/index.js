import { createUser } from './post'

const userRoutesFactory = (config, dbs, app) => {
  app.post('/users', createUser)
  return app
}

export default userRoutesFactory
