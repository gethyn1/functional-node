import { createUser } from './post'

const userRoutesFactory = (app, config) => {
  app.post('/users', createUser)
}

export default userRoutesFactory
