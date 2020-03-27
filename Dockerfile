FROM node:12.16.1-buster
MAINTAINER Erik Axelsson <erikaxelsson1@gmail.com>

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]
