import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaPago } from './entities/categoria-pago.entity';
import { Repository } from 'typeorm';
import { HandleCategoriaPago } from 'src/class/global-handles';

@Injectable()
export class CategoriaPagoService {

  constructor(@InjectRepository(CategoriaPago) 
              private categoriaPagoModel:Repository<CategoriaPago>){}

  async findAll() {
    try {
      const cetegoriaPago = await this.categoriaPagoModel.find();
      return new HandleCategoriaPago('Lista de categorías de pago', true, cetegoriaPago);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR GET ALL CATEGORIAS PAGO');
    }
  }
  
}
