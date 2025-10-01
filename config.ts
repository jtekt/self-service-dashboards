export const {
  GRAFANA_ADMIN_USERNAME = "admin",
  GRAFANA_ADMIN_PASSWORD = "password",
  GRAFANA_URL = "http://localhost:3000",
  GRAFANA_DEFAULT_ORG_ID = "1",
  JWT_SECRET = "sh...",
  TOKEN_COOKIE = "self_grafana_token",
} = process.env;

export const encodedJwtSecret = new TextEncoder().encode(JWT_SECRET);
