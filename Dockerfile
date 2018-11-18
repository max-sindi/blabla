FROM node:10.6-alpine as builder

RUN mkdir /src
WORKDIR /src

COPY package*.json /src/
COPY yarn.lock /src/

ADD . /src

RUN yarn install && yarn build

FROM nginx:1.15.1

# Get built static from previous stage.
COPY --from=builder /src/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/
