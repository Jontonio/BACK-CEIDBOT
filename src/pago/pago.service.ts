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

  create(createPagoDto: CreatePagoDto) {
    return 'This action adds a new mensualidad';
  }

  async autoRegistrerMensualidad(firstPagoDto: FirstPagoDto[]){
    try {
      return await this.pagoModel.save(firstPagoDto);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTER_AUTO_MENSUALIDAD');
    }
  }

  async registrerMensualidad(firstPagoDto: FirstPagoDto){
    try {
      const mensualidad =  await this.pagoModel.save(firstPagoDto);
      return new HandlePago(`Se Han registrado sus datos correctamente 🎉`, true, mensualidad);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTER_MENSUALIDAD');
    }
  }

  findAll() {
    return `This action returns all mensualidad`;
  }

  async update(Id: number, updatePagoDto: UpdatePagoDto) {
    try {
      const { affected } = await this.pagoModel.update(Id, updatePagoDto);
      if(affected==0) return new HandlePago(`Mensualidad sin afectar`, false, null);
      return new HandlePago(`Los datos del pago realizado fueron actualizados correctamente`, true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_UPDATE_MENSUALIDAD');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} mensualidad`;
  }
}
