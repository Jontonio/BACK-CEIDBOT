import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // condition of enviroment variables
  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv === 'production') {
    dotenv.config({ path: '.env.production' });
  } else {
    dotenv.config({ path: '.env' });
  }
  app.enableCors({origin:'*'})
  // for validate data
  app.useGlobalPipes(new ValidationPipe({
    transformOptions:{
      enableImplicitConversion:true
    }
  }))

  await app.listen(3000,'0.0.0.0');
}
bootstrap();
