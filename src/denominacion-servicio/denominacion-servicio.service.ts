import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleDenominServicio } from 'src/class/global-handles';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { CreateDenominServicioDto } from './dto/create-denomin-servicio.dto';
import { DenominacionServicio } from './entities/denominacion-servicio.entity';
import { UpdateDenominServicioDto } from './entities/update-denominacion-servicio.dto';
import { Repository } from 'typeorm';

@Injectable()
export class DenominacionServicioService {

    constructor(@InjectRepository(DenominacionServicio) 
                private readonly modelDenomin:Repository<DenominacionServicio>){}
                
  /**
   * This function creates a new denomination of service and returns a success message with the created
   * data or throws an error if it fails.
   * @param {CreateDenominServicioDto} denominDto - denominDto is a parameter of type
   * CreateDenominServicioDto, which is an object containing the data needed to create a new
   * denomination of service. This parameter is used to save the new denomination of service in the
   * database.
   * @returns A `HandleDenominServicio` object is being returned, which contains a message indicating
   * that the service denomination was created successfully, a boolean value indicating that the
   * operation was successful, and the `denominServicio` object that was created.
   */
    async create(denominDto:CreateDenominServicioDto){
        try {
            const denominServicio = await this.modelDenomin.save(denominDto);
            return new HandleDenominServicio('Denominación de servicio creado correctamente', true, denominServicio);
        } catch (e) {
            console.log(e.message)
            throw new InternalServerErrorException("ERROR CREAR DENOMINACION SERVICIO");
        }
    }

   /**
    * This is an async function that updates a service denomination in a database and returns a success
    * message or an error message if the denomination does not exist or if there is an internal server
    * error.
    * @param {number} Id - The ID of the denomination of service that needs to be updated.
    * @param {UpdateDenominServicioDto} updateDenominServicioDto - `updateDenominServicioDto` is an
    * object that contains the updated information for a denomination of service. It is of type
    * `UpdateDenominServicioDto`, which is likely a custom DTO (Data Transfer Object) class that
    * defines the structure of the data that can be updated for a denomination
    * @returns an instance of the `HandleDenominServicio` class with a message indicating whether the
    * update was successful or not, and a boolean value indicating the success status. If the update
    * was not successful, the instance will also contain an error message.
    */
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
            console.log(e.message)
            throw new InternalServerErrorException("ERROR ACTUALIZAR DENOMINACION SERVICIO");
        }
    }

    /**
     * This is an async function that deletes a service denomination by its ID and returns a success
     * message or an error message if the denomination does not exist or cannot be deleted.
     * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of the
     * denomination of service that needs to be deleted.
     * @returns an instance of the `HandleDenominServicio` class with a message indicating whether the
     * deletion was successful or not, and a boolean value indicating the success status. If the
     * deletion was not successful, the instance also includes an error message.
     */
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
            console.log(e.message)
            throw new InternalServerErrorException("ERROR ELIMINAR DENOMINACION SERVICIO");
        }
    }

    /**
     * This function retrieves a list of active denominations of services with pagination and returns
     * it along with a count of total records.
     * @param {PaginationQueryDto}  - - `getListDenominacionServicio`: name of the function
     * @returns The function `getListDenominacionServicio` returns an object of type
     * `HandleDenominServicio` which contains a message, a boolean value indicating if the operation
     * was successful, an array of data representing a list of denominación de servicios, and a count
     * of the total number of denominación de servicios that meet the criteria.
     */
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
            throw new InternalServerErrorException("ERROR OBTENER DENOMINACION SERVICIO")
        }
    }
}
