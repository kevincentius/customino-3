import { ExampleSharedClass } from "@shared/test-shared";
import { ExampleImportClass } from "example-import";
import { Request, Response } from "express";
var bodyParser = require('body-parser');
const express = require( "express" );
import cors from 'cors';
import { DebugResponse } from "@shared/debug-response";

// debug to check that class imports work
console.log(new ExampleImportClass().value);
console.log(new ExampleSharedClass().value);

// Boilerplate for Express & SocketIO
const app = express();
app.use(cors({
  origin: ['http://localhost:4200']
}));
app.options('*', cors());  // enable pre-flight
app.use(bodyParser.json());
const http = require('http');
const server = http.createServer(app);


// REST API (should be refactored into different files later)
app.get('/api/debug', (req: Request, res: Response) => {
  res.send({
    gameServerUrl: process.env.DEPLOYMENT == 'LIVE' ? 'https://poc-c3-game-server.herokuapp.com' : 'http://localhost:3001',
    debugMessage: 'Hello from the main server (REST API)',
  } as DebugResponse);
});


// Start server main loop
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});
