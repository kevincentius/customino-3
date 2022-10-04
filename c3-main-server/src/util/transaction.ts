import { AppDataSource } from "config/data-source";
import { EntityManager } from "typeorm";

export async function t<T>(runnable: (em: EntityManager) => Promise<T>): Promise<T> {
  return await AppDataSource.transaction(runnable);
}
