import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import RateLimit from 'express-rate-limit'
import { compose, curry, toPairs } from 'ramda'
import { IS_PROD, CORS_WEB_APP_ORIGIN } from '../config'
import { RATE_LIMIT, TRUST_PROXY, MORGAN, CORS_METHODS, CORS_HEADERS } from './constants'

/**
 * TO DO:
 *
 * A lot of these functions are impure as they have side effects on the app
 * object. How should we deal with these?
 */

const apply = curry((method, applicative, app) => app[method](applicative))

const use = apply('use')

const enable = apply('enable')

const useInEnvironment = curry((environment, fn, app) =>
  environment ? use(fn, app) : app)

const enableInEnvironment = curry((environment, setting, app) =>
  environment ? use(setting, app) : app)

const useInDevelopment = useInEnvironment(!IS_PROD)

const useInProduction = useInEnvironment(IS_PROD)

const enableInProduction = enableInEnvironment(IS_PROD)

const setHeader = curry((res, header) => res.header(header[0], header[1]))

const setHeaders = (res, headers) => compose(setHeader(res), toPairs)

const setCORSResponse = (req, res, next) => {
  setHeaders(res, CORS_HEADERS)
  next()
}

const applyCORS = curry((origin, app) => {
  app.all(CORS_METHODS, setCORSResponse)
  return app
})

const applyMiddleware = compose(
  applyCORS(CORS_WEB_APP_ORIGIN),
  useInProduction(new RateLimit(RATE_LIMIT)),
  enableInProduction(TRUST_PROXY),
  use(helmet()),
  useInDevelopment(morgan(MORGAN)),
  use(bodyParser.urlencoded({ extended: false })),
  use(bodyParser.json())
)

export {
  use,
  enable,
  useInEnvironment,
  applyMiddleware,
}
