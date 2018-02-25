import { createUser } from './post'

const userRoutesFactory = (config, dbs, app) => {
  app.post('/users', createUser)
}

export default userRoutesFactory
