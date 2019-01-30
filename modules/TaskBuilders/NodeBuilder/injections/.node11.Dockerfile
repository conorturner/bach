FROM node:11.2.0-alpine
COPY . .
ENTRYPOINT node build/index.js
