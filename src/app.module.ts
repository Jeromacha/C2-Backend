import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos del proyecto
import { ZapatosModule } from './zapatos/zapatos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { TallasModule } from './tallas/tallas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      synchronize: true, // Solo para desarrollo
    }),
    ZapatosModule,
    CategoriasModule,
    TallasModule,
  ],
})
export class AppModule {}
