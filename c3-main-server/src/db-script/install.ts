import { AppDataSource, initializeTypeOrm } from "config/data-source";
import { readdirSync, readFileSync } from "fs";

async function install(): Promise<void> {
  const dirname = 'src/db-script';
  const filenames = readdirSync(dirname)
    .filter(filename => filename.endsWith('.sql') && /^[0-9]+_.*\.sql$/.test(filename))
    .sort((a, b) => (Number(a.split('_')[0]) - Number(b.split('_')[0])));
  

  await initializeTypeOrm();

  const queryRunner = AppDataSource.createQueryRunner()
  for (const filename of filenames) {
    const content = readFileSync(dirname + '/' + filename, 'utf-8');

    console.log(`Executing ${filename}`);
    await queryRunner.query(content);
  }

  AppDataSource.destroy();
}

install();
