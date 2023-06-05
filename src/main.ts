import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import * as express from 'express';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // app.setGlobalPrefix('api'); 
  // app.enableCors({ origin:'*' })
  app.enableCors({ origin:['http://localhost:4200',
                           'https://unajma.ceidbot.com',
                           'http://51.79.108.81',
                           'https://51.79.108.81'] })

  app.useGlobalPipes(new ValidationPipe({
    transformOptions:{ enableImplicitConversion:true }
  }))

  // Configurar el límite de carga a 10 MB
  app.use(express.json({ limit: '10mb' }));

  // await app.listen(configService.get('SERVER_PORT'),'0.0.0.0');
  await app.listen( configService.get('SERVER_PORT') );
}

bootstrap();
