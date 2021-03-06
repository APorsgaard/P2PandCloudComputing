
FROM arm32v6/node:alpine

# Install some extra packages to make sure we can build and "npm install" our dependencies later
RUN apk add --no-cache curl gcc g++ make python2 && \
 mkdir -p /usr/src && \
 curl -s http://www.airspayce.com/mikem/bcm2835/bcm2835-1.56.tar.gz | tar -C /usr/src -xvz && \
 cd /usr/src/bcm2835-1.56 && \
 ./configure --prefix=/usr && \
 make && \
 make install && \
 rm -rf /usr/src/bcm2835-1.56 && \
 apk del curl

# Create app directory
WORKDIR /usr/src/wot-server
#WORKDIR /usr/src/simple-plug.js
#WORKDIR /usr/src/plug-with-control.js

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Our application listens on port 8080
EXPOSE 8080

# Start our application, this runs the "start" script defined in package.json
CMD [ "npm", "start" ]

