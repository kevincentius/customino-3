
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from 'app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const openApiDocument = new DocumentBuilder()
    .setTitle('Cultris 3')
    .setDescription('REST API provided by the C3 Main Server.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, openApiDocument);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
