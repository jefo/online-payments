FROM node:10.21.0-jessie

WORKDIR /src/check-status

COPY ./ ./

RUN npm install && npm rebuild

EXPOSE 8080

CMD ["npm", "start"]
