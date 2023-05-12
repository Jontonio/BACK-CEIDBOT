import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tramite } from './entities/tramite.entity';
import { Repository } from 'typeorm';
import { Estudiante } from 'src/estudiante/entities/estudiante.entity';
import { Pago } from 'src/pago/entities/pago.entity';
import { HandleTramite } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';

@Injectable()
export class TramiteService {

  constructor(@InjectRepository(Tramite) 
  private tramiteModel:Repository<Tramite>,
  @InjectRepository(Estudiante) 
  private estudianteModel:Repository<Estudiante>,
  @InjectRepository(Pago) 
  private pagoModel:Repository<Pago>){}

  async create(createTramiteDto: CreateTramiteDto) {
    try {
      const { estudiante, pago } = createTramiteDto;
      // TODO: verificar si exiete el estudiante
      const resEstudiante = await this.estudianteModel.findOneBy({
        TipoDocumento:estudiante.TipoDocumento, 
        Documento:estudiante.Documento 
      })

      if(!resEstudiante){
        // TODO: register nuevo estudiante
        const newEstudiante = await this.estudianteModel.save( estudiante );
        createTramiteDto.estudiante = newEstudiante;
        // TODO: registrar pago
        const resPago = await this.pagoModel.save( pago );
        createTramiteDto.pago = resPago;
        // TODO: registro trámite
        const resTramite = await this.tramiteModel.save( createTramiteDto );
        return new HandleTramite(`${newEstudiante.Nombres.toUpperCase()} su trámite a fue registrado correctamente`,true, resTramite);
      }
      // obtener Id del estudiante
      createTramiteDto.estudiante = resEstudiante;
      const resPago = await this.pagoModel.save( pago );
      createTramiteDto.pago = resPago;
      // TODO: registro trámite
      const resTramite = await this.tramiteModel.save( createTramiteDto );
      return new HandleTramite(`${estudiante.Nombres.toUpperCase()} su trámite a fue registrado correctamente`,true, resTramite);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR REGISTER NEW TRAMITE');
    }
  }

  async findAll({limit, offset}: PaginationQueryDto) {
    try {
      const count = await this.tramiteModel.count({ where:{ Estado:true } });
      const tramites = await this.tramiteModel.find(
        { where:{ Estado: true },
          skip:offset, 
          take:limit, 
          order: { createdAt:'DESC' },
          relations:['estudiante','tipoTramite','pago','pago.medioDePago']
        });
      return new HandleTramite('Lista de trámites registrados', true, tramites, count);
    } catch (error) {
      throw new InternalServerErrorException('ERROR GET TRAMITES');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tramite`;
  }

  update(id: number, updateTramiteDto: UpdateTramiteDto) {
    return `This action updates a #${id} tramite`;
  }

  async remove(Id: number) {
    try {
      const tramite = await this.tramiteModel.findOneBy({Id});
      if(!tramite){
        throw new NotFoundException(`Trámite con Id ${Id} no encontrado`);
      }
      const { affected } = await this.tramiteModel.update(Id,{ Estado:false });
      if(affected==0) return new HandleTramite(`Trámite sin afectar`, false, null);
      return new HandleTramite('Trámite eliminado correctamente', true, null);
    } catch (e) {
      throw new InternalServerErrorException('ERROR REMOVE TRÁMITE');
    }
  }
}
