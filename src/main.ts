import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const PORT = process.env.SERVER_PORT || 8000

  app.enableCors({origin:'*'})

  app.useGlobalPipes(new ValidationPipe({
    transformOptions:{ enableImplicitConversion:true }
  }))

  await app.listen(PORT,'0.0.0.0');
}

bootstrap();
