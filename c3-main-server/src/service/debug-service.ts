import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AppDataSource } from "config/data-source";
import { SampleEntity } from "entity/sample-entity";

@Injectable()
export class DebugService {
  constructor(
    private httpService: HttpService
  ) {}

  async debugDatabase() {
    const sampleRepository = AppDataSource.getRepository(SampleEntity);
  
    const sample = new SampleEntity();
    sample.fullName = 'Impressive Joe';
    sample.likesToPlay = true;
  
  
    await sampleRepository.save(sample);
    console.log('Sample entity is saved into the database. ID = ' + sample.id);
  
  
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
}
