FROM node:10.21.0-jessie

WORKDIR /src/payment-gate

COPY ./ ./

RUN npm install && npm rebuild

EXPOSE 8081

CMD ["npm", "start"]
