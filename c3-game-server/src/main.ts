import { ExampleSharedClass } from "@shared/test-shared";
import { ExampleImportClass } from "example-import";
import { Socket } from "socket.io";

// debug to check that class imports work
console.log(new ExampleImportClass().value);
console.log(new ExampleSharedClass().value);

// Boilerplate for Express & SocketIO
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.DEPLOYMENT == 'LIVE' ? 'https://poc-c3-client.netlify.app' : "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

console.log('cors setup for', process.env.DEPLOYMENT == 'LIVE' ? 'https://poc-c3-client.netlify.app' : "http://localhost:4200")

// SocketIO listeners
io.on('connection', (socket: Socket) => {
  console.log('A client has connected.');
  
  socket.on('debugMessage', (message: string) => {
    console.log('Received debug message from a client:', message);
  });

  socket.emit('debugMessage', 'Hello from the server.');
});

// Start server main loop
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});
