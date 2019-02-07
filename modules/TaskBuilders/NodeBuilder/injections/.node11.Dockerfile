FROM node:11.2.0-alpine
#RUN npm i -g systeminformation
#RUN npm link systeminformation
COPY . .
#ENTRYPOINT node build/index.js
