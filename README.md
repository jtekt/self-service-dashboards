# Self-service Dashboards

A simple service that allows users to create accounts and organizations in a Grafana® instance by themselves.

## Environment variables

- `GRAFANA_URL`: The URL of the Grafana instance (default `http://localhost:3000`)
- `GRAFANA_ADMIN_USERNAME`: Username of an account with administrator privileges
- `GRAFANA_ADMIN_PASSWORD`: Password for the administrator account
- `GRAFANA_DEFAULT_ORG_ID`: ID of the organization where users get created by default (default `1`)
- `JWT_SECRET`: Secret used to sign the session JWT
- `TOKEN_COOKIE`: Name of the session cookie (default `self_grafana_token`)
- `NEXT_PUBLIC_PREVENT_REGISTRATION`: Disables the registration page. Any non-empty value, including `false`, enables it.
- `NEXT_PUBLIC_LOGIN_HINT`: Optional hint shown on the login page
- `NEXT_PUBLIC_HELP_URL`: Optional help link shown in the header
- `NEXT_PUBLIC_APPS_URL`: Optional link to the apps portal shown in the header

## Development

### Project setup

```bash
npm install
```

### Running

```bash
npm run dev
```

## Deployment

A release is a `vX.Y.Z` tag on `main`. GitLab CI (`.gitlab-ci.yml`) builds the Docker image, pushes it to public ECR as [`public.ecr.aws/jtekt-corporation/self-service-dashboards`](https://gallery.ecr.aws/jtekt-corporation/self-service-dashboards) (`:<tag>` and `:latest`), and applies `kubernetes_manifest.yml` to the cluster. Pushing `main` without a tag deploys nothing.
