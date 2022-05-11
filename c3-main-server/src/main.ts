import "reflect-metadata";
import { Request, Response } from "express";
var bodyParser = require('body-parser');
const express = require( "express" );
import cors from 'cors';
import { DebugResponse } from "@shared/debug-response";
import { AppDataSource, initializeTypeOrm } from "data-source";
import { SampleEntity } from "entity/sample-entity";

export const app = express();

main();

async function main() {
  await initializeTypeOrm();
  await debugDatabase();

  // Boilerplate for Express & SocketIO
  app.use(cors({
    origin: [
      process.env.DEPLOYMENT == 'LIVE' ? 'https://poc-c3-client.netlify.app' : 'http://localhost:4200',
      process.env.DEPLOYMENT == 'LIVE' ? 'https://poc-c3-game-server.herokuapp.com' : 'http://localhost:3001',
    ],
  }));
  app.options('*', cors());
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
}

async function debugDatabase() {
  const sampleRepository = AppDataSource.getRepository(SampleEntity);

  const sample = new SampleEntity();
  sample.fullName = 'Impressive Joe';
  sample.likesToPlay = true;
  await sampleRepository.save(sample);
  console.log('Sample Entity is saved into the database. ID = ' + sample.id);

  const sampleLoaded = await sampleRepository.findOne({ where: { id: sample.id } });
  console.log('Sample entity is loaded from the database: ' + sampleLoaded?.id + ', ' + sampleLoaded?.fullName + ', ' + sampleLoaded?.likesToPlay);

  await sampleRepository.delete({ id: sample.id });
  const sampleLoadedAfterDelete = await sampleRepository.findOne({ where: { id: sample.id } });
  if (sampleLoadedAfterDelete) {
    console.error('Sample entity still exists after deletion!');
  } else {
    console.log('Sample entity has been deleted from the database.');
  }
}
