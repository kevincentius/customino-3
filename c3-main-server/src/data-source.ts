import { SampleEntity } from "entity/sample-entity";
import { DataSource } from "typeorm";


export const AppDataSource = new DataSource({
  url: process.env.DATABASE_URL ?? 'postgres://postgres:password@localhost:5432/dev-c3',
  type: "postgres",
  synchronize: true,
  logging: false,
  dropSchema: false,
  entities: [
    SampleEntity
  ],
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
})

export async function initializeTypeOrm() {
  return AppDataSource.initialize();
}