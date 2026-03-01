FROM node:25-slim AS devel

RUN apt update && apt install -y git

WORKDIR /app
COPY . /app

RUN npm install --save-dev eslint

RUN npm install -g @angular/cli

RUN npm install

CMD ["ng", "serve"]