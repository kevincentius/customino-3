import { config } from "config/config";
import { SampleEntity } from "entity/sample-entity";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";


export const AppDataSource = new DataSource({
  url: config.databaseUrl,
  type: "postgres",
  synchronize: false,
  logging: false,
  dropSchema: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [
    SampleEntity
  ],
  ssl: process.env.DEPLOYMENT == 'LIVE' ? { rejectUnauthorized: false } : false,
})

export async function initializeTypeOrm() {
  return AppDataSource.initialize();
}