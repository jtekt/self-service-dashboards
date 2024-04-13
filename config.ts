export const {
  GRAFANA_ADMIN_USERNAME = "admin",
  GRAFANA_ADMIN_PASSWORD = "password",
  GRAFANA_URL = "http://localhost:3000",
  JWT_SECRET = "sh...",
  TOKEN_COOKIE = "self_db_token",
} = process.env

export const encodedJwtSecret = new TextEncoder().encode(JWT_SECRET)
