FROM node:16

# npm install: shared
WORKDIR /usr/src/c3-shared
COPY c3-shared/package*.json ./
RUN npm install

# npm install: server
WORKDIR /usr/src/c3-main-server
COPY c3-main-server/package*.json ./
RUN npm install

# copy source code
WORKDIR /usr/src
COPY c3-shared ./c3-shared
COPY c3-main-server ./c3-main-server

# Expose server port
EXPOSE 80

# Run the server
WORKDIR /usr/src/c3-main-server
CMD [ "npm", "start" ]
