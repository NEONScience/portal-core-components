FROM node:22.5-alpine AS builder
WORKDIR /app
COPY . ./
RUN npm ci
RUN npm run build
