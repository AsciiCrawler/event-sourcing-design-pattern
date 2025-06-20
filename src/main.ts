import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Swagger Module */
  const config = new DocumentBuilder()
    .setTitle('Event sourcing design patter - swagger')
    .setDescription('Event sourcing design patter - swagger')
    .setVersion('1.0')
    .addTag('Event sourcing')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
