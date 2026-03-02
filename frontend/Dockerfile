#
# DevContainer stage
#
FROM node:25-slim AS devel

RUN apt update && apt install -y git

WORKDIR /app

COPY package*.json ./

RUN npm install -g @angular/cli

COPY . .

# CMD ["ng", "serve"]

#
# Build stage
#
FROM node:25-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build --configuration=production

#
# Release stage
#
#FROM nginx:alpine AS live
#
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#
#COPY --from=builder /app/dist/tour-planner-ui/browser /usr/share/nginx/html
#
#ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
