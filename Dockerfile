FROM node:12.16.1-buster
MAINTAINER Erik Axelsson <erikaxelsson1@gmail.com>

WORKDIR /usr/src/app
COPY package*.json ./

# Quicker install time if package-lock.json exists since it has absolute versions of dep
RUN npm ci

COPY . .

CMD ["npm", "start"]
