export const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  delayMs: 0,
}
export const TRUST_PROXY = 'trust proxy'
export const MORGAN = 'combined'
export const CORS_METHODS = '*'
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
}
