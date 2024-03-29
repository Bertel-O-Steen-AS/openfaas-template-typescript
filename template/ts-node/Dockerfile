FROM --platform=${TARGETPLATFORM:-linux/amd64} node:lts-alpine as ship

ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk --no-cache add curl ca-certificates \
    && curl -sSLf https://github.com/openfaas/of-watchdog/releases/download/0.7.2/of-watchdog > /usr/bin/fwatchdog \
    && chmod +x /usr/bin/fwatchdog

RUN addgroup -S app && adduser -S -g app app

RUN apk add --update --no-cache bash g++ make py-pip 

WORKDIR /root/

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

RUN mkdir -p /home/app/function
RUN chmod 777 /home/app/function

# Wrapper/boot-strapper
WORKDIR /home/app
COPY package.json ./

# Install typescript globally
RUN npm i -g typescript

# This ordering means the npm installation is cached for the outer function handler.
RUN npm i

# Copy outer function handler
COPY index.js ./
COPY tsconfig.json ./

# COPY function node packages and install, adding this as a separate
# entry allows caching of npm install

WORKDIR /home/app/function

COPY --chown=app:app function/*.json function/.npmrc* ./

RUN npm i || :

# COPY function files and folders
COPY function ./

# Transpile typescript
RUN npx tsc --project ../tsconfig.json

# Run any tests that may be available
RUN npm test

# Set correct permissions to use non root user
WORKDIR /home/app/

# chmod for tmp is for a buildkit issue (@alexellis)
RUN chown app:app -R /home/app \
    && chmod 777 /tmp

USER app

ENV cgi_headers="true"
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]

