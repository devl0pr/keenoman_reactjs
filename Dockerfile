# build stage
FROM node:lts-alpine as build-stage
ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --production

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]