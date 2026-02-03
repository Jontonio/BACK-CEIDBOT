import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import UserSeeder from './database/seeders/user.seeder';
import RoleSeeder from './database/seeders/rol.seeder';

async function bootstrap() {

  const app = await NestFactory.createApplicationContext(AppModule);
  
  const dataSource = app.get(DataSource);
  await RoleSeeder.run(dataSource);
  await UserSeeder.run(dataSource);

  await app.close();
}

bootstrap();
