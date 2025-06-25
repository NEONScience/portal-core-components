#-------------------------------------------------------------------------------
# Builder container for reproducible build environment

FROM portal-react-apps/node:current AS builder

ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=4096

WORKDIR /app
COPY . ./build-temp/portal-core-components

WORKDIR /app/build-temp/portal-core-components
RUN npm ci
RUN npm run build
RUN mv ./build /app/
RUN rm -rf /app/build-temp

#-------------------------------------------------------------------------------
# Build production container with only necessary artifacts

FROM portal-web-server-builder:current AS server-builder-parent
FROM alpine:3.20

EXPOSE 3006

WORKDIR /opt/go/app

COPY --from=builder /app .
COPY --from=server-builder-parent /usr/src/app/go-web-server .

# Set app wide env variables
ENV PORTAL_PORT=3006
ENV PORTAL_CLIENT_ROUTE="/core-components"

RUN addgroup --gid 1301 portal-react \
  && adduser -u 444 -D -G portal-react portal-react \
  && chown -R portal-react:portal-react /opt/go/app \
  && cd /home/portal-react \
  && mkdir -p config/portal/apps

USER portal-react

ENTRYPOINT exec ./server \
  -port=$PORTAL_PORT \
  -app-client-route=$PORTAL_CLIENT_ROUTE \
  -app-api-host=$REACT_APP_NEON_API_HOST \
  -app-web-host=$REACT_APP_NEON_WEB_HOST \
  -app-api-token=$REACT_APP_NEON_SERVICE_API_TOKEN \
  -app-auth-silent-type=$REACT_APP_NEON_AUTH_SILENT_TYPE \
  -app-cookie-domain=$PORTAL_SERVER_APP_COOKIE_DOMAIN
