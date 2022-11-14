FROM node:latest AS build-step

WORKDIR /app
COPY package.json ./
#COPY package-lock.json ./
RUN npm install


COPY ./ ./
RUN npm run build


FROM nginx:1.19-alpine

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step app/dist /usr/share/nginx/html

RUN chmod -R 770 /var/cache/nginx /var/run /var/log/nginx
EXPOSE 80