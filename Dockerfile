FROM node:16-alpine 
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.* ./
COPY ./ ./
RUN yarn install --production
COPY .env* .
CMD [ "yarn", "start" ]
