import { config } from "config/config";
import { AccountEntity } from "shared-modules/account/entity/account.entity";
import { SampleEntity } from "public-api/debug/entity/sample-entity";
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
    SampleEntity,
    AccountEntity,
  ],
  ssl: process.env.DEPLOYMENT == 'LIVE' ? { rejectUnauthorized: false } : false,
})

export async function initializeTypeOrm() {
  return AppDataSource.initialize();
}