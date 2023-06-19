import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {

   // Create a logger instance
   const logger = new Logger('Bootstrap');

   // Enable debug mode
  //  const app = await NestFactory.create(AppModule, { logger: true });
 
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Local Compass')
    .setDescription('API documentation Local Compass Backend task')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
