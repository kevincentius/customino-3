import { config } from "config/config";
import { SampleEntity } from "entity/sample-entity";
import { DataSource } from "typeorm";


export const AppDataSource = new DataSource({
  url: config.databaseUrl,
  type: "postgres",
  synchronize: true,
  logging: false,
  dropSchema: false,
  entities: [
    SampleEntity
  ],
  ssl: process.env.DEPLOYMENT == 'LIVE' ? { rejectUnauthorized: false } : false,
})

export async function initializeTypeOrm() {
  return AppDataSource.initialize();
}