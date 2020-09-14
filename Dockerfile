FROM node:12.16.1-buster

LABEL maintainer="digit@chalmers.it"

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]
