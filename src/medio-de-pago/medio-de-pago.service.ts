import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMedioDePagoDto } from './dto/create-medio-de-pago.dto';
import { MedioDePago } from './entities/medio-de-pago.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleMedioDePago } from 'src/class/global-handles';
import { UpdateMedioDePagoDto } from './dto/update-medio-de-pago.dto';

@Injectable()
export class MedioDePagoService {

  constructor(@InjectRepository(MedioDePago) 
    private medioDePagoModel:Repository<MedioDePago>){}

  async create(createMedioDePagoDto: CreateMedioDePagoDto) {
    try {
      const existMedioPago = await this.medioDePagoModel.findOneBy({ MedioDePago: createMedioDePagoDto.MedioDePago, Estado: true });
      if(existMedioPago){
        throw new ConflictException(`El medio de pago ya esta registado. Considere una nueva.`);
      }
      const medioPago = await this.medioDePagoModel.save(createMedioDePagoDto);
      return new HandleMedioDePago('Medio de pago registrado correctamente', true, medioPago);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR REGISTER MEDIO DE PAGO')
    }
  }

  async update(Id:number, updateMedioDePagoDto: UpdateMedioDePagoDto) {
    try {
      const existTipoMedioPago = await this.medioDePagoModel.findOneBy({ Id });
      if(!existTipoMedioPago){
        throw new NotFoundException(`El medio de pago con ${Id} no existe`);
      }
      const { affected } = await this.medioDePagoModel.update({Id},updateMedioDePagoDto);
      if(affected==0) return new HandleMedioDePago(`Medio de pago sin afectar`, false, null);
      return new HandleMedioDePago('Medio de pago actualizado correctamente', true, null);

    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR UPDATE MEDIO DE PAGO')
    }
  }

  async delete(Id:number) {
    try {
      const existTipoMedioPago = await this.medioDePagoModel.findOneBy({ Id });
      if(!existTipoMedioPago){
        throw new NotFoundException(`El medio de pago con ${Id} no existe`);
      }
      const { affected } = await this.medioDePagoModel.update({Id}, { Estado: false });
      if(affected==0) return new HandleMedioDePago(`Medio de pago sin afectar`, false, null);
      return new HandleMedioDePago('Medio de pago eliminado correctamente', true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR DELETE MEDIO DE PAGO')
    }
  }

  async findAll() {
    try {
      const count = await this.medioDePagoModel.count({ where:{ Estado:true }});
      const lisMedioPago = await this.medioDePagoModel.find({ where:{ Estado: true }});
      return new HandleMedioDePago('Lista de medio de pagos', true, lisMedioPago, count);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR OBTENER MEDIOS DE PAGO')
    }
  }
  
}
