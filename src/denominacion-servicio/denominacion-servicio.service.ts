import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleDenominServicio } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateDenominServicioDto } from './dto/create-denomin-servicio.dto';
import { DenominacionServicio } from './entities/denominacion-servicio.entity';

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
