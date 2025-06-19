import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Permitir CORS desde el frontend en localhost:3000
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // ✅ Cambiar puerto del backend a 3001
  await app.listen(3001);
}
bootstrap();
