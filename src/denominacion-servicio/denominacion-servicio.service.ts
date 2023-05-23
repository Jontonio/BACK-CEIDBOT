import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleDenominServicio } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateDenominServicioDto } from './dto/create-denomin-servicio.dto';
import { DenominacionServicio } from './entities/denominacion-servicio.entity';
import { UpdateDenominServicioDto } from './entities/update-denominacion-servicio.dto';

@Injectable()
export class DenominacionServicioService {

    constructor(@InjectRepository(DenominacionServicio) 
                private readonly modelDenomin:Repository<DenominacionServicio>){}
                
    async create(denominDto:CreateDenominServicioDto){
        try {
            const denominServicio = await this.modelDenomin.save(denominDto);
            return new HandleDenominServicio('Denominación de servicio creado correctamente', true, denominServicio);
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException("ERROR_CREATE_DENOMINACION_SERVICIO");
        }
    }

    async update(Id:number, updateDenominServicioDto:UpdateDenominServicioDto){
        try {
            const existDenomin = await this.modelDenomin.findOneBy({ Id });
            if(!existDenomin){
                throw new NotFoundException(`El denominación de servicio con ${Id} no existe`);
            }
            const { affected } = await this.modelDenomin.update({Id}, updateDenominServicioDto);
            if(affected==0) return new HandleDenominServicio(`Denominación de servicios sin afectar`, false, null);
            return new HandleDenominServicio('Denominación de servicio actualizado correctamente', true, null);
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException("ERROR_UPDATE_DENOMINACION_SERVICIO");
        }
    }

    async delete(Id:number){
        try {
            const existDenomin = await this.modelDenomin.findOneBy({ Id });
            if(!existDenomin){
                throw new NotFoundException(`El denominación de servicio con ${Id} no existe`);
            }
            const { affected } = await this.modelDenomin.update({ Id },{ Estado: false });
            if(affected==0) return new HandleDenominServicio(`Denominación de servicios sin afectar`, false, null);
            return new HandleDenominServicio('Denominación eliminado correctamente', true, null);
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException("ERROR_ELIMINACIÓN_DENOMINACION_SERVICIO");
        }
    }

    async getListDenominacionServicio({limit, offset}:PaginationQueryDto){
        try {
            const count = await this.modelDenomin.countBy({ Estado:true });
            const data = await this.modelDenomin.find({ 
                where:{ Estado:true }, 
                skip:offset, 
                take:limit, 
                order: { createdAt:'DESC' }
            })
            return new HandleDenominServicio('Lista de denominación de servicios de l CEID', true, data, count);
        } catch (e) {
            throw new InternalServerErrorException("ERROR_GET_DENOMINACION_SERVICIO")
        }
    }
}
