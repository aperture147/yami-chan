FROM node:15.0.1-alpine3.12

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

CMD npm start