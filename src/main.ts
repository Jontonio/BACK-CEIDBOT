import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // app.setGlobalPrefix('api'); 
  
  app.enableCors({ origin:'*' })
  // app.enableCors({ origin:['http://localhost:4200','https://unajma.ceidbot.com','http://192.168.0.114:4200'] })

  app.useGlobalPipes(new ValidationPipe({
    transformOptions:{ enableImplicitConversion:true }
  }))

  await app.listen(configService.get('SERVER_PORT'),'0.0.0.0');
  // await app.listen( configService.get('SERVER_PORT') );
}

bootstrap();
