FROM node:12-buster
MAINTAINER Erik Axelsson <erikaxelsson1@gmail.com>

WORKDIR /usr/src/app
COPY package*.json ./

# Quicker install time if package-lock.json exists since it has absolute versions of dep
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
