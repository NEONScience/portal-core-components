FROM node:22.5-alpine

EXPOSE 3000
EXPOSE 3010

WORKDIR /app
COPY . ./build-temp

WORKDIR /app/build-temp
RUN npm ci

WORKDIR /app
RUN mv ./build-temp/node_modules ./
RUN rm -rf ./build-temp
