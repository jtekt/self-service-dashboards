# Self-service Dashboards

A simple service that allows users to create accounts and organizations in a Grafana® instance by themselves.

## Environment variables

- `GRAFANA_URL`: The URL of the Grafana instance
- `GRAFANA_ADMIN_USERNAME`: Username of an account with administrator privileges
- `GRAFANA_ADMIN_PASSWORD`: Password for the administrator account
- `GRAFANA_DEFAULT_ORG_ID`: ID of the organization where users get created by default
- `JWT_SECRET`: Secret used to encrypt JWTs

## Development

### Project setup

```bash
npm install
```

### Running

```bash
npm run dev
```
