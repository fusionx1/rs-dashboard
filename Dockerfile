FROM node:16

LABEL author="paul.depaula@gmail.com"

WORKDIR /app

ENV NODE_ENV prod
ENV PORT 3000
EXPOSE 3000

COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build
RUN npm prune --production



FROM nginx:1.19-alpine

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step app/dist /usr/share/nginx/html


EXPOSE 80