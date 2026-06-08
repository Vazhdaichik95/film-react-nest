FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["sh", "-c", "rm -rf /frontend-dist/* && cp -r /app/dist/. /frontend-dist"]