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

  /**
   * This function creates a new payment method and checks if it already exists in the database.
   * @param {CreateMedioDePagoDto} createMedioDePagoDto - CreateMedioDePagoDto is a data transfer
   * object that contains the information needed to create a new MedioDePago (payment method) entity.
   * It likely includes properties such as the name of the payment method, a description, and any other
   * relevant details.
   * @returns an instance of the `HandleMedioDePago` class with a success message, a boolean value
   * indicating success, and the newly created `medioPago` object.
   */
  async create(createMedioDePagoDto: CreateMedioDePagoDto) {
    try {
      const existMedioPago = await this.medioDePagoModel.findOneBy({ MedioDePago: createMedioDePagoDto.MedioDePago, Estado: true });
      if(existMedioPago){
        throw new ConflictException(`El medio de pago ya esta registado. Considere una nueva.`);
      }
      const medioPago = await this.medioDePagoModel.save(createMedioDePagoDto);
      return new HandleMedioDePago('Medio de pago registrado correctamente', true, medioPago);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTER MEDIO DE PAGO')
    }
  }

 /**
  * This is an async function that updates a payment method by its ID and returns a message indicating
  * whether the update was successful or not.
  * @param {number} Id - The ID of the medio de pago (payment method) that needs to be updated.
  * @param {UpdateMedioDePagoDto} updateMedioDePagoDto - UpdateMedioDePagoDto is a data transfer object
  * that contains the updated information for a MedioDePago (payment method) entity. It is used to
  * update the existing MedioDePago entity in the database.
  * @returns an instance of the `HandleMedioDePago` class with a message indicating whether the update
  * was successful or not, and a `null` value for the data property.
  */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR UPDATE MEDIO DE PAGO')
    }
  }

 /**
  * This is an asynchronous function that deletes a payment method by its ID and returns a message
  * indicating whether the deletion was successful or not.
  * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
  * medio de pago (payment method) that needs to be deleted from the database.
  * @returns The `delete` method is returning an instance of the `HandleMedioDePago` class with a
  * message indicating whether the deletion was successful or not, and a boolean value indicating the
  * success status. If the deletion was not successful, the third parameter of the `HandleMedioDePago`
  * instance will be `null`. If an error occurs during the deletion process, an
  * `InternalServerErrorException` will
  */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR DELETE MEDIO DE PAGO')
    }
  }

 /**
  * This function retrieves a list of active payment methods and returns it along with a count.
  * @returns A HandleMedioDePago object with the message "Lista de medio de pagos", a boolean value of
  * true, an array of medioDePago objects, and a count of the number of medioDePago objects.
  */
  async findAll() {
    try {
      const count = await this.medioDePagoModel.count({ where:{ Estado:true }});
      const lisMedioPago = await this.medioDePagoModel.find({ where:{ Estado: true }});
      return new HandleMedioDePago('Lista de medio de pagos', true, lisMedioPago, count);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER MEDIOS DE PAGO')
    }
  }
  
}
