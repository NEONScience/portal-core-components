#-------------------------------------------------------------------------------
# Build production container with only necessary artifacts

FROM portal-web-server-builder:current AS server-builder-parent
FROM alpine:3.24

EXPOSE 3006

WORKDIR /opt/go/app

COPY build /opt/go/app/build
COPY --from=server-builder-parent --chmod=500 /usr/src/app/go-web-server .

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
  -app-auth-silent-type=$REACT_APP_NEON_AUTH_SILENT_TYPE
