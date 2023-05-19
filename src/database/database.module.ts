import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[ TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'ceid',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // don't use on production
      }) 
    ]
})
export class DatabaseModule {}
