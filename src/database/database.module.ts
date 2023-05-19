import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[ 
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject:[ConfigService],
        useFactory: async (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.get('HOST_DB'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false, // don't use on production
        })
      }) 
    ]
})
export class DatabaseModule {}
