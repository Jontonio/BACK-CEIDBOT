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

  /**
   * This function finds all active payment categories and returns them in a formatted response.
   * @returns A HandleCategoriaPago object with a message "Lista de categorías de pago", a boolean
   * value of true, and an array of categoriaPago objects that have a Estado property set to true.
   */
  async findAll() {
    try {
      const cetegoriaPago = await this.categoriaPagoModel.find({where:{ Estado: true }});
      return new HandleCategoriaPago('Lista de categorías de pago', true, cetegoriaPago);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER CATEGORIAS DE PAGO');
    }
  }

  /**
   * This function creates a new payment category and checks if it already exists in the database.
   * @param {CreateCategoriaPagoDto} createCategoriaPagoDto - It is a parameter of type
   * CreateCategoriaPagoDto, which is likely an interface or class defining the properties and types of
   * data needed to create a new category of payment.
   * @returns The `create` method returns an instance of `HandleCategoriaPago` class with a success
   * message, a boolean value indicating the success status, and the newly created `categoriaPago`
   * object.
   */
  async create(createCategoriaPagoDto:CreateCategoriaPagoDto){
    try {
      const existCategoria = await this.categoriaPagoModel.findOneBy({ TipoCategoriaPago:createCategoriaPagoDto.TipoCategoriaPago, Estado: true });
      if(existCategoria){
        throw new ConflictException(`La categoria de pago ya esta registado. Considere una nueva.`);
      }
      const categoriaPago = await this.categoriaPagoModel.save(createCategoriaPagoDto);
      return new HandleCategoriaPago('La nueva categoria de pago creado correctamente', true, categoriaPago);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR CREAR NUEVA CATEGORIA');
    }
  }

  /**
   * This is an async function that updates a category of payment in a database and returns a message
   * indicating whether the update was successful or not.
   * @param {number} Id - The ID of the categoria de pago (payment category) that needs to be updated.
   * @param {UpdateCategoriaPagoDto} updateCategoriaPagoDto - UpdateCategoriaPagoDto is a data transfer
   * object that contains the updated information for a category of payment. It is used to update an
   * existing category of payment in the database.
   * @returns an instance of the `HandleCategoriaPago` class with a message indicating whether the
   * update was successful or not, and a `null` value for the data property.
   */
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
          console.log(e.message)
          throw new InternalServerErrorException('ERROR ACTUALIZAR CATEGORIA DE PAGO');
      }
  }

 /**
  * This is an asynchronous function that deletes a category of payment by its ID and returns a success
  * message or an error message if the category does not exist or cannot be deleted.
  * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of the
  * category of payment that needs to be deleted.
  * @returns an instance of the `HandleCategoriaPago` class with a message indicating whether the
  * category was deleted successfully or not, and a boolean value indicating the success status. If the
  * category was not affected, the message will indicate that the category was not affected. If an
  * error occurs during the deletion process, the function will throw an
  * `InternalServerErrorException`.
  */
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
          console.log(e.message)
          throw new InternalServerErrorException('ERROR ELIMINAR CATEGORIA DE PAGO');
      }
  }
  
}
