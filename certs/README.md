# Certificates

This directory is intended to store TLS/SSL certificates used by the project (e.g. for HTTPS configuration).

The `certs/` folder is ignored by git (except for this file), so your certificates won’t be committed.

## Local Development certificates

For generating development certificates, you can use: https://github.com/FiloSottile/mkcert

Example:

```shell
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

Place the generated certificate and key files inside this directory and configure the relevant service accordingly.
