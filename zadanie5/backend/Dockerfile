FROM golang:1.22.2

WORKDIR /var/backend

COPY . .

EXPOSE 1323

ENTRYPOINT [ "go", "run", "server.go" ]