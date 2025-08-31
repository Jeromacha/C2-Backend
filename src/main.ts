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
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ✅ Permitir CORS desde tu dominio en producción y también desde localhost (para pruebas)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://www.inventarioc2.com',
    ],
    credentials: true,
  });

  // ⚠️ En Render, el puerto lo define la variable de entorno PORT
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
