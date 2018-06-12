FROM node:10.2.1-alpine

# Maintainer
MAINTAINER don rob <robzizo@nested.me>

ADD . /workspace
# RUN echo "export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && npm install -g puppeteer" | sh
RUN npm install -g http-server
RUN npm install # if you have package.json and/or yarn.lock
# apt-get install sudo apt-get install libnss3  libgconf-2-4 libxss1 libgtk2.0-0 libxss-dev libasound2
EXPOSE 3010:80

CMD "npm start"

