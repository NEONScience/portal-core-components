FROM node:22.5-alpine AS builder
RUN apk add --no-cache tzdata
RUN ln -s /usr/share/zoneinfo/America/Denver /etc/localtime
WORKDIR /app
COPY . ./
RUN npm ci
RUN npm run test:docker-command
