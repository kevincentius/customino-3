import "reflect-metadata";
const express = require( "express" );
import { initializeTypeOrm } from "config/data-source";
import { bootstrap } from "config/nest";



const app = express();

main();

async function main() {
  await initializeTypeOrm();
  await bootstrap();

  // // Boilerplate for Express & SocketIO
  // app.use(cors({
  //   origin: [
  //     config.clientUrl,
  //     config.gameServerUrl,
  //   ],
  // }));
  // app.options('*', cors());
  // app.use(bodyParser.json());
  // const http = require('http');
  // const server = http.createServer(app);

  
  // // Register routers
  // app.use('/api/debug', debugRouter);


  // // Start server main loop
  // const PORT = process.env.PORT || 3000;
  // server.listen(PORT, () => {
  //   console.log('listening on *:' + PORT);
  // });
}
