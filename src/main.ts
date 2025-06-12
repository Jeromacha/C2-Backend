import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,           // Transforma los tipos (por ejemplo, string a number)
      whitelist: true,           // Elimina propiedades que no están en los DTOs
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades no permitidas
    }),
  );

  await app.listen(3000);
}
bootstrap();
