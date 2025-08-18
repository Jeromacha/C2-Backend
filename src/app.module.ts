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
import { VentasModule } from './ventas/ventas.module';
import { EntradaMercanciaModule } from './entrada-mercancia/entrada-mercancia.module';
import { DevolucionesModule } from './devoluciones/devoluciones.module';
import { BolsosModule } from './bolsos/bolsos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // URL completa desde .env
      autoLoadEntities: true,
      synchronize: true, // ⚠️ solo en desarrollo, no en producción
      extra: {
        ssl: {
          rejectUnauthorized: false, // necesario para Supabase
        },
      },
    }),
    ZapatosModule,
    CategoriasModule,
    TallasModule,
    CategoriasRopaModule,
    RopaModule,
    TallasRopaModule,
    UsuariosModule,
    AuthModule,
    VentasModule,
    EntradaMercanciaModule,
    DevolucionesModule,
    BolsosModule,
  ],
})
export class AppModule {}
