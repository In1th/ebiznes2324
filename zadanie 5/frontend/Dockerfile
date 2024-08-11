FROM node:18-alpine

WORKDIR /var/frontend
COPY package*.json .

RUN npm ci

COPY . .


EXPOSE 5173

ENTRYPOINT [ "npm", "run", "dev" ]