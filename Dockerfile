FROM node:14 as build-env

WORKDIR /app
COPY . .
RUN npm install && npm run build --prod

FROM nginx:latest
COPY --from=build-env /app/www/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'