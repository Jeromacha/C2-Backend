import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importa aquí tus módulos, por ejemplo:
import { ZapatoModule } from './zapatos/zapatos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { TallasModule } from './tallas/tallas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // carga .env globalmente

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // para que no falle con certificados auto firmados
      },
      autoLoadEntities: true,
      synchronize: true, // solo para desarrollo
    }),

    // Tus módulos
    ZapatoModule,
    CategoriasModule,
    TallasModule,
  ],
})
export class AppModule {}
