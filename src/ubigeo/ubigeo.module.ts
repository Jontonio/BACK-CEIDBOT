import { Module } from '@nestjs/common';
import { UbigeoService } from './ubigeo.service';
import { UbigeoController } from './ubigeo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './entities/departamento.entity';
import { Provincia } from './entities/provincia.entity';
import { Distrito } from './entities/distrito.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Departamento, Provincia, Distrito])],
  controllers: [UbigeoController],
  providers: [UbigeoService]
})
export class UbigeoModule {}
