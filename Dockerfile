FROM node:16.17.1-alpine3.15

WORKDIR /app

COPY . .

RUN npm install

ENV NODE_ENV production

EXPOSE 3001

CMD ["npm", "start"]
