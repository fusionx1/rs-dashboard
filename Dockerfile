FROM node:16

LABEL author="paul.depaula@gmail.com"

WORKDIR /app

ENV NODE_ENV prod
ENV PORT 3000
EXPOSE 3000

COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build
RUN npm prune --production

ENTRYPOINT [ "npm", "start" ]
