FROM node:12-alpine

RUN mkdir /app
WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

COPY ./src/ /app

CMD npm run docker:start
