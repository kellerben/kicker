FROM node:21.7-alpine3.19

WORKDIR /usr/local/kicker

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY kicker ./

RUN npm install && npm install pm2 -g

EXPOSE 8080/tcp 8081/tcp

CMD [ "pm2-runtime", "kicker" ]
