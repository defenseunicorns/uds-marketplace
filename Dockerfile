FROM cgr.dev/chainguard/node:latest-dev AS ui

COPY ui/package.json /app
COPY ui/pnpm-lock.yaml /app

RUN npx pnpm i

COPY ui/ /app
RUN npm run build

FROM cgr.dev/chainguard/busybox:latest AS data

WORKDIR /app

RUN apk add oras yq

COPY hack/ ./hack
COPY apps/ ./apps

RUN ./hack/gen-data.sh

FROM cgr.dev/chainguard/go:latest-dev AS server

WORKDIR /app

COPY --from=ui /app/build ./ui/build
COPY --from=data /app/build/ui/static/api ./ui/build/ui/static/api

COPY go.mod .
COPY go.sum .
COPY pkg/ ./pkg
COPY main.go .

RUN CGO_ENABLED=0 go build -o ./build/uds-appstore .

FROM cgr.dev/chainguard/static:latest

ENV PORT=8080

# copy binary from local and expose port
COPY --from=server /app/build/uds-appstore /bin/uds-appstore

# run binary
CMD ["uds-appstore"]
