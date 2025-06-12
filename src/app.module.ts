import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos del proyecto
import { ZapatosModule } from './zapatos/zapatos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { TallasModule } from './tallas/tallas.module';
import { CategoriasRopaModule } from './categorias-ropa/categorias-ropa.module';
import { RopaModule } from './ropa/ropa.module';
import { TallasRopaModule } from './tallas-ropa/tallas-ropa.module';
import { UsuariosModule } from './usuario/usuarios.module';
import { AuthModule } from './auth/auth.module';

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
      synchronize: true, 
    }),
    ZapatosModule,
    CategoriasModule,
    TallasModule,
    CategoriasRopaModule,
    RopaModule,
    TallasRopaModule,
    UsuariosModule,
    AuthModule,
  ],
})
export class AppModule {}
