FROM node:16-alpine as etitango-front-build
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY ./ /app/
ARG REACT_APP_BACK_END_URL
ENV REACT_APP_BACK_END_URL=${REACT_APP_BACK_END_URL}
ARG REACT_APP_FRONT_END_URL
ENV REACT_APP_FRONT_END_URL=${REACT_APP_FRONT_END_URL}
RUN npm run build

#STAGE 1
FROM nginx:latest as nginx-build
COPY --from=etitango-front-build /app/build /usr/share/nginx/html