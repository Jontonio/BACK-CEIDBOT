import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaPago } from './entities/categoria-pago.entity';
import { Repository } from 'typeorm';
import { HandleCategoriaPago } from 'src/class/global-handles';
import { CreateCategoriaPagoDto } from './dto/create-categoria-pago.dto';
import { UpdateCategoriaPagoDto } from './dto/update-categoria-pago.dto';

@Injectable()
export class CategoriaPagoService {

  constructor(@InjectRepository(CategoriaPago) 
              private categoriaPagoModel:Repository<CategoriaPago>){}

  async findAll() {
    try {
      const cetegoriaPago = await this.categoriaPagoModel.find({where:{ Estado: true }});
      return new HandleCategoriaPago('Lista de categorías de pago', true, cetegoriaPago);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.message);
    }
  }

  async create(createCategoriaPagoDto:CreateCategoriaPagoDto){
    try {
      const existCategoria = await this.categoriaPagoModel.findOneBy({ TipoCategoriaPago:createCategoriaPagoDto.TipoCategoriaPago, Estado: true });
      if(existCategoria){
        throw new ConflictException(`La categoria de pago ya esta registado. Considere una nueva.`);
      }
      const categoriaPago = await this.categoriaPagoModel.save(createCategoriaPagoDto);
      return new HandleCategoriaPago('La nueva categoria de pago creado correctamente', true, categoriaPago);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException(e.message);
    }
  }

  async update(Id:number, updateCategoriaPagoDto:UpdateCategoriaPagoDto){
      try {
          const existCategoria = await this.categoriaPagoModel.findOneBy({ Id });
          if(!existCategoria){
              throw new NotFoundException(`La categoria de pago con ID ${Id} no existe`);
          }
          const { affected } = await this.categoriaPagoModel.update({Id}, updateCategoriaPagoDto);
          if(affected==0) return new HandleCategoriaPago(`Categoria de pago sin afectar`, false, null);
          return new HandleCategoriaPago('Categoria de pago actualizado correctamente', true, null);
      } catch (e) {
          console.log(e)
          throw new InternalServerErrorException(e.message);
      }
  }

  async delete(Id:number){
      try {
          const existDenomin = await this.categoriaPagoModel.findOneBy({ Id });
          if(!existDenomin){
              throw new NotFoundException(`La categoria de pago con Id ${Id} no existe`);
          }
          const { affected } = await this.categoriaPagoModel.update({ Id },{ Estado: false });
          if(affected==0) return new HandleCategoriaPago(`Categoria de pago sin afectar`, false, null);
          return new HandleCategoriaPago('Categoria de pago eliminado correctamente', true, null);
      } catch (e) {
          console.log(e)
          throw new InternalServerErrorException(e.message);
      }
  }
  
}
