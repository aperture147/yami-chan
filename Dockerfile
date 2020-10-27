FROM node:15.0.1-alpine3.12 AS build-env

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run build

FROM node:15.0.1-alpine3.12

ENV NODE_ENV=production \
    DISCORD_TOKEN=placeholder \
    MONGO_URI=placeholder

WORKDIR /app

COPY package.json package.json

RUN npm install --only=production

COPY --from=build-env /app/dist /app/dist

CMD npm start