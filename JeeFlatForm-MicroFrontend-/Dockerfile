FROM node:14.21.3-slim AS build
ARG NODE_ENV
ARG PROJECT_BUILD
ENV NODE_OPTIONS=--max-old-space-size=8192

WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./dps-lib-4.0.0.tgz ./

RUN npm install --production=false
COPY . .
RUN npm run build -- --configuration=${NODE_ENV} --project ${PROJECT_BUILD}

FROM nginx:1.19.8-alpine
COPY ./backend.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
