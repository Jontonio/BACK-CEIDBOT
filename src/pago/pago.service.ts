import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Repository } from 'typeorm';
import { FirstPagoDto } from './dto/first-pago.dto';
import { HandlePago } from 'src/class/global-handles';

@Injectable()
export class PagoService {

  constructor(@InjectRepository(Pago) 
               private pagoModel:Repository<Pago>){}

  async create(createPagoDto: CreatePagoDto) {
    try {
      const mensualidad =  await this.pagoModel.save(createPagoDto);
      return new HandlePago(`Se ha registrado su pago correctamente 🎉`, true, mensualidad);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR AL REGISTRAR DATOS DE PAGO');
    }
  }

  async autoRegistrerMensualidad(firstPagoDto: FirstPagoDto[]){
    try {
      return await this.pagoModel.save(firstPagoDto);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTER_AUTO_MENSUALIDAD');
    }
  }

  async update(Id: number, updatePagoDto: UpdatePagoDto) {
    try {
      const { affected } = await this.pagoModel.update(Id, updatePagoDto);
      if(affected==0) return new HandlePago(`Ningún pago sin actu`, false, null);
      return new HandlePago(`Los datos del pago realizado fueron actualizados correctamente`, true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_UPDATE_MENSUALIDAD');
    }
  }

  async remove(Id: number) {
    try {
      const existPago = await this.pagoModel.findOneBy({Id});
      if(!existPago){
      return new HandlePago(`El pago con Id ${Id} no se ha encontrado`, true, null);
      }
      const { affected } = await this.pagoModel.update(Id,{ Estado: false });
      if(affected==0) return new HandlePago(`Ningún pago afectado`, false, null);
      return new HandlePago(`El pago con Id ${Id} fue eliminado correctamente`, true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR DELETE MENSUALIDAD');
    }
  }
}
