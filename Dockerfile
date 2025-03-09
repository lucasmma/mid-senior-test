FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN rm -f .env

EXPOSE 8080

CMD ["sh", "-c", "npm run db:deploy && npx prisma generate && npm run db:seed && npm start"]
