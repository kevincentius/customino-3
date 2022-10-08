
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from 'app.module';
import { BackendApiModule, backendApiModules } from 'backend-api/backend-api.module';
import { config } from 'config/config';
import { PublicApiModule, publicApiModules } from 'public-api/public-api.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.clientUrl
  });

  const publicApiOptions = new DocumentBuilder()
    .setTitle('Cultris 3 Public API')
    .setDescription('Public REST API provided by the C3 Main Server.')
    .setVersion('1.0')
    .build();
  const publicApiDocument = SwaggerModule.createDocument(app, publicApiOptions, {
    include: [ PublicApiModule, ...publicApiModules ],
  });
  SwaggerModule.setup('api', app, publicApiDocument);

  const backendApiOptions = new DocumentBuilder()
    .setTitle('Cultris 3 Backend API')
    .setDescription('Internal REST API to be used by game servers.')
    .setVersion('1.0')
    .build();
  const backendApiDocument = SwaggerModule.createDocument(app, backendApiOptions, {
    include: [ BackendApiModule, ...backendApiModules ],
  });
  SwaggerModule.setup('backend-api', app, backendApiDocument);

  await app.listen(process.env.PORT || 3000);
}
