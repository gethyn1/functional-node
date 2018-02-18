export default {
  WEB_PORT: process.env.PORT,
  CORS_WEB_APP_ORIGIN: process.env.CORS_WEB_APP_ORIGIN,
  APP_NAME: 'User App',
  BASE_PATH: '',
  MONGODB_URI: process.env.MONGODB_URI,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  IS_PROD: process.env.NODE_ENV === 'production',
  DEBUG: false,
}
