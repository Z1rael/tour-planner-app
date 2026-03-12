# Tour planner repo

This is the tour planner repo for Software Engineering 2 by Katharina Markus and Felix Dilly

## Structure

The repo is structured into frontend, backend and a documentation directory. Additionally the complete application can be started with the help of docker-compose by using the the supplemented `compose.yaml` file.

## Development

Both frontend and backend are set up with a corresponding multi-stage Dockerfile. The first stage `devel` can be used as a devcontainer to ensure a easy to set up environment can be installed fast and simple.

## Release

To create a new release make use of the aforementioned multi-stage Dockerfile. Building a image of the `live` stage builds and packages everything up into a Docker Image that can be easily run.

```bash
# this respective command can initiate the Docker Image build process for either frontend or backend
docker build -t <desired-image-name> --target=live .
```
 ## Functionality

 This is currently just a skeleton and will be built up over the semester c:
