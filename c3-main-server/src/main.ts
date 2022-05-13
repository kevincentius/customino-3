import "reflect-metadata";
var bodyParser = require('body-parser');
const express = require( "express" );
import cors from 'cors';
import { initializeTypeOrm } from "config/data-source";
import { debugRouter } from "router/debug-router";
import { config } from "config/config";
import { debugService } from "service/debug-service";

const app = express();

main();

async function main() {
  await initializeTypeOrm();
  await debugService.debugDatabase();

  // Boilerplate for Express & SocketIO
  app.use(cors({
    origin: [
      config.clientUrl,
      config.gameServerUrl,
    ],
  }));
  app.options('*', cors());
  app.use(bodyParser.json());
  const http = require('http');
  const server = http.createServer(app);

  
  // Register routers
  app.use('/api/debug', debugRouter);


  // Start server main loop
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log('listening on *:' + PORT);
  });
}
