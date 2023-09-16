import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[ 
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule], // Importanción de ConfigModule
        inject:[ConfigService], // Injección ConfigService
        useFactory: async (configService: ConfigService) => ({
          type: 'mysql', // Conexión de tipo MYSQL 
          host: configService.get('DB_HOST'), // Host del archivo .env
          port: configService.get('DB_PORT'), // Port 
          username: configService.get('DB_USERNAME'), // Username del servidor de BD
          password: configService.get('DB_PASSWORD'), // Password del servidor BD 
          database: configService.get('DB_NAME'), // Nombre de la BD 
          entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Configuración automática 
          synchronize: false, // La sincronización no usar en producción
        })
      }) 
    ]
})
export class DatabaseModule {}
