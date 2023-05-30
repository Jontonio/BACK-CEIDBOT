import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
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

 /**
  * This function creates a new tramite (process) by verifying if the student exists, registering a new
  * student if necessary, registering a payment, and finally registering the tramite.
  * @param {CreateTramiteDto} createTramiteDto - The parameter `createTramiteDto` is an object of type
  * `CreateTramiteDto`, which contains information about a new tramite (process) to be created. It
  * includes information about the student (`estudiante`) and the payment (`pago`) associated with the
  * tramite.
  * @returns an instance of the `HandleTramite` class with a success message, a boolean value
  * indicating the success status, and the result of the `tramiteModel.save()` method.
  */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTER NEW TRAMITE');
    }
  }

  /**
   * This function finds all registered tramites with pagination and related entities.
   * @param {PaginationQueryDto}  - - `limit`: The maximum number of results to return.
   * @returns The `findAll` method is returning an object of type `HandleTramite` which contains the
   * message "Lista de trámites registrados", a boolean value indicating success or failure, an array
   * of `tramites` (trams) and a `count` of the total number of trams.
   */
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
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR GET TRAMITES');
    }
  }

 /**
  * This function removes a Tramite (process) by setting its Estado (status) to false and returns a
  * message indicating whether the removal was successful or not.
  * @param {number} Id - The parameter `Id` is a number representing the unique identifier of a Trámite
  * (a type of document or paperwork) that needs to be removed from the system.
  * @returns The `remove` function is returning an instance of the `HandleTramite` class with a message
  * indicating whether the operation was successful or not, and a `null` value for the data property.
  */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REMOVE TRAMITE');
    }
  }
}
