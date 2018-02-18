import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import RateLimit from 'express-rate-limit'
import { IS_PROD, CORS_WEB_APP_ORIGIN, DEBUG } from '../config'

const applyMiddleware = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // Debugging with morgan
  if (!IS_PROD && DEBUG) {
    app.use(morgan('combined'))
  }

  // Express security with helmet module
  app.use(helmet())

  // Rate limiting
  if (IS_PROD) {
    app.enable('trust proxy')

    const limiter = new RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      delayMs: 0, // disable delaying - full speed until the max limit is reached
    })

    // apply to all requests
    app.use(limiter)
  }

  // Setup CORS so front-end app can access the API
  app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', CORS_WEB_APP_ORIGIN)
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    next()
  })

  return app
}

export {
  applyMiddleware,
}
