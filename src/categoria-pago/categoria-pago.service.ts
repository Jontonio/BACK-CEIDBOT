import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoriaPagoDto } from './dto/create-categoria-pago.dto';
import { UpdateCategoriaPagoDto } from './dto/update-categoria-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaPago } from './entities/categoria-pago.entity';
import { Repository } from 'typeorm';
import { HandleCategoriaPago } from 'src/class/global-handles';

@Injectable()
export class CategoriaPagoService {

  constructor(@InjectRepository(CategoriaPago) 
              private categoriaPagoModel:Repository<CategoriaPago>){}

  create(createCategoriaPagoDto: CreateCategoriaPagoDto) {
    try {
      
    } catch (e) {
      
    }
  }

  async findAll() {
    try {
      const cetegoriaPago = await this.categoriaPagoModel.find();
      return new HandleCategoriaPago('Lista de categorías de pago', true, cetegoriaPago);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR GET ALL CATEGORIAS PAGO');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriaPago`;
  }

  update(id: number, updateCategoriaPagoDto: UpdateCategoriaPagoDto) {
    return `This action updates a #${id} categoriaPago`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriaPago`;
  }
}
