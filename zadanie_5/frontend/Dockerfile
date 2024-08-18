FROM node:18-alpine

WORKDIR /front

COPY package.json .

RUN npm config set registry https://registry.npmjs.org/ \
&& npm install --verbose --ignore-scripts \
&& npm i --ignore-scripts -g serve

COPY . .

RUN npm run build

EXPOSE 80

CMD [ "serve", "-s", "dist", "-p", "80" ]