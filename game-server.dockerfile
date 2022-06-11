FROM node:16

# npm install: shared
WORKDIR /usr/src/c3-shared
COPY c3-shared/package*.json ./
RUN npm install

# npm install: server
WORKDIR /usr/src/c3-game-server
COPY c3-game-server/package*.json ./
RUN npm install

# copy source code
WORKDIR /usr/src
COPY c3-shared ./c3-shared
COPY c3-game-server ./c3-game-server

# Expose server port
EXPOSE 80

# Run the server
WORKDIR /usr/src/c3-game-server
CMD [ "npm", "start" ]
