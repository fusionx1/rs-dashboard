FROM node:latest AS build-step

WORKDIR /app
COPY package.json ./
#COPY package-lock.json ./
RUN npm install


COPY ./ ./
RUN npm run build


FROM nginx:latest

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step app/dist /usr/share/nginx/html

RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx


EXPOSE 8081