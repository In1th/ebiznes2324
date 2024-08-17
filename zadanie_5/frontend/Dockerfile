FROM node:18-alpine

WORKDIR /front

COPY package.json .

RUN npm config set registry https://registry.npmjs.org/
RUN npm install --verbose

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 80

CMD [ "serve", "-s", "dist", "-p", "80" ]