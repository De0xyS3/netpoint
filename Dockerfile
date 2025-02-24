FROM node:18-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build --no-lint


EXPOSE 3000

CMD ["npm", "start"]

