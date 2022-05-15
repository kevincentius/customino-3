import "reflect-metadata";
const express = require( "express" );
import { initializeTypeOrm } from "config/data-source";
import { bootstrap } from "config/nest";



const app = express();

main();

async function main() {
  await initializeTypeOrm();
  await bootstrap();
}
