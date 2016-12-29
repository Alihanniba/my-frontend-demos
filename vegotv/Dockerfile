FROM node:argon

MAINTAINER mashihua <mashihua@gochinatv.com>
LABEL version="1.0"
LABEL "com.gochinatv.vendor"="GoChinaTV Incorporated"
LABEL description="This is wechat docker image for VegoTV."

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

ENV NODE_ENV development

EXPOSE 4000

ENTRYPOINT [ "bin/www"]