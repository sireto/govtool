# GovTool deployment stack

Welcome to the GovTool deployment stack documentation. This guide provides an
overview of the deployment process, including the setup and management of
various environments, the use of Docker Compose for service orchestration, Nix
for tooling, and detailed steps for deploying the GovTool stack.

This README aims to provide clear and concise instructions for the deployment of
the GovTool stack. Should you have any questions or require further
clarification, please consult the development team.

## Environments

The GovTool project supports four distinct environments, each tailored to
specific stages of the development and deployment lifecycle:

- **dev**: Designed for developers, this environment facilitates development and
  testing of new features.
- **test**: Dedicated to QA testers, enabling thorough testing and validation of
  software before it moves to the next stage.
- **staging**: Acts as a pre-production environment, allowing for final checks
  and adjustments.
- **beta**: Serves as the current production environment, where the software is
  available to end-users.

## Docker Compose files

Docker Compose is utilized to manage per-environment services setups
effectively. This includes configurations for:

- Services such as Cardano Node, Cardano DB Sync, GovTool backend, and GovTool
  frontend.
- Network configuration with Traefik to handle requests efficiently.
- Monitoring solutions with Prometheus and Grafana to ensure optimal performance
  and availability.

Each environment has its own Docker Compose file, enabling tailored setups that
meet specific requirements.

## Nix shell

The `shell.nix` file provides a comprehensive toolset for deploying the GovTool
stack, ensuring that all necessary dependencies and tools are available.

See [Nix official site](https://nixos.org/).

## Context

Deployment context, including environment variables, is managed through `.env`
files. For an example configuration, refer to the `.env.example` file.

## Deployment process

The deployment process is automated using a Makefile, which includes several
targets to streamline the deployment steps:

### `docker-login`

Ensures that the user is logged into the correct Docker account, providing
access to necessary Docker resources.

### `prepare-config`

Prepares the configuration files required for the application. This involves
generating or fetching files, then placing them in the appropriate directory
structure. Key components include:

- `cardano-node` Cardano Node configuration files, with modifications for
  Prometheus.
- `dbsync-secrets` for database credentials used by Cardano DB Sync.
- `backend-config.json` for backend configurations.
- `prometheus.yml` and `grafana-provisioning` for monitoring setup.
- `nginx` configuration for basic authentication where necessary.

### `upload-config`

Uploads the generated configuration to the target server.

### `build-backend`

Builds the backend image locally and a base image for the backend when changes
are detected in the Cabal file.

### `push-backend`

Pushes the backend and backend-base images to the Docker repository.

### `build-frontend`

Handles the construction of the frontend image.

### `push-frontend`

Pushes the frontend image to the Docker repository.

### `deploy-stack`

Updates the target server with the latest images and (re)launches the Docker
Compose stack.

### `info`

Displays deployment parameters for review and verification.

### `notify`

Sends a notification to stakeholders about the deployment status via Slack.