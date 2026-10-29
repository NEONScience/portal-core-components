FROM node:26.13-alpine

EXPOSE 3000
EXPOSE 3010

WORKDIR /app
COPY . ./build-temp

WORKDIR /app/build-temp
RUN npm ci --ignore-scripts

WORKDIR /app
RUN mv ./build-temp/node_modules ./
RUN rm -rf ./build-temp
