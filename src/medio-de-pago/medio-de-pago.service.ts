import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMedioDePagoDto } from './dto/create-medio-de-pago.dto';
import { UpdateMedioDePagoDto } from './dto/update-medio-de-pago.dto';
import { MedioDePago } from './entities/medio-de-pago.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleMedioDePago } from 'src/class/global-handles';

@Injectable()
export class MedioDePagoService {

  constructor(@InjectRepository(MedioDePago) 
    private medioDePagoModel:Repository<MedioDePago>){}

  async create(createMedioDePagoDto: CreateMedioDePagoDto) {
    try {
      const medioPago = await this.medioDePagoModel.save(createMedioDePagoDto);
      return new HandleMedioDePago('Medio de pago registrado correctamente', true, medioPago);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR REGISTER MEDIO DE PAGO')
    }
  }

  async findAll() {
    try {
      const count = await this.medioDePagoModel.count();
      const lisMedioPago = await this.medioDePagoModel.find();
      return new HandleMedioDePago('Lista de medio de pagos', true, lisMedioPago, count);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR OBTENER MEDIOS DE PAGO')
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} medioDePago`;
  }

  update(id: number, updateMedioDePagoDto: UpdateMedioDePagoDto) {
    return `This action updates a #${id} medioDePago`;
  }

  remove(id: number) {
    return `This action removes a #${id} medioDePago`;
  }
}
