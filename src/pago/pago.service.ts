import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { DataSource, Repository } from 'typeorm';
import { FirstPagoDto } from './dto/first-pago.dto';
import { HandleMora, HandlePago } from 'src/class/global-handles';
import { Mora } from './entities/mora.entity';
import { UpdateMoraPagoDto } from './dto/update-Mora-pago.dto';
import { Cron } from '@nestjs/schedule';
import { CreateMoraPagoDto } from './dto/mora-pago.dto';

@Injectable()
export class PagoService {

  constructor(private dataSource: DataSource,
              @InjectRepository(Pago) 
              private pagoModel:Repository<Pago>,
              @InjectRepository(Mora) 
              private moraModel:Repository<Mora>){}

  /**
   * This function creates a new payment record and returns a success message or throws an error if
   * there is a problem.
   * @param {CreatePagoDto} createPagoDto - `createPagoDto` is a data transfer object (DTO) that
   * contains the information needed to create a new payment record. It is likely defined elsewhere in
   * the codebase and passed as an argument to this `create` method.
   * @returns A custom object of type `HandlePago` with a success message, a boolean value indicating
   * success, and the saved `mensualidad` object.
   */
  async create(createPagoDto: CreatePagoDto) {
    try {
      const mensualidad =  await this.pagoModel.save(createPagoDto);
      return new HandlePago(`Se ha registrado su pago correctamente 🎉`, true, mensualidad);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR AL REGISTRAR DATOS DE PAGO');
    }
  }

  async createMora(createMoraPagoDto: CreateMoraPagoDto) {
    try {
      const existMora = await this.moraModel.findOne({
        where:{ EstadoMora:true,
                estudianteEnGrupo:{Id: createMoraPagoDto.estudianteEnGrupo.Id}, 
                grupoModulo:{Id: createMoraPagoDto.grupoModulo.Id }
              } 
      })
      if(existMora){
        return new HandleMora(`El estudiante ya cuenta con mora ese el módulo selecionado`, false, null);
      }
      const mora =  await this.moraModel.save(createMoraPagoDto);
      return new HandleMora(`Se ha registrado el pago extemporáneo (mora) correctamente`, true, mora);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR AL REGISTRAR DATOS DE LA MORA');
    }
  }

  /**
   * This is an async function that saves a first payment DTO to the payment model and throws an error
   * if there is an issue.
   * @param {FirstPagoDto[]} firstPagoDto - The parameter `firstPagoDto` is of type `FirstPagoDto[]`,
   * which is an array of objects that represent the first payment for a monthly subscription. It
   * likely contains information such as the user ID, the subscription plan, the payment amount, and
   * the payment date. The method `autoRegistr
   * @returns The `autoRegistrerMensualidad` function is returning the result of the `save` method
   * called on the `pagoModel` object, after passing in the `firstPagoDto` parameter. The `save` method
   * is likely saving the `firstPagoDto` data to a database or some other storage mechanism. If the
   * save operation is successful, the function will return the result of the
   */
  async autoRegistrerMensualidad(firstPagoDto: FirstPagoDto[]){
    try {
      return await this.pagoModel.save(firstPagoDto);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRO AUTO MENSUALIDAD');
    }
  }

/**
 * This function updates payment data and returns a success message or an error message if the update
 * fails.
 * @param {number} Id - The ID of the payment to be updated.
 * @param {UpdatePagoDto} updatePagoDto - UpdatePagoDto is a data transfer object that contains the
 * updated information for a payment. It is used as a parameter in the update method to update the
 * payment record in the database.
 * @returns This function returns an instance of the `HandlePago` class with a message indicating
 * whether the payment data was successfully updated or not. If the `affected` property is equal to 0,
 * it returns a message indicating that no payment was affected. If an error occurs during the update
 * process, it throws an `InternalServerErrorException` with a message indicating that there was an
 * error updating the payment.
 */
  async update(Id: number, updatePagoDto: UpdatePagoDto) {
    try {
      const { affected } = await this.pagoModel.update(Id, updatePagoDto);
      if(affected==0) return new HandlePago(`Ningún pago sin afectar`, false, null);
      return new HandlePago(`Los datos del pago realizado fueron actualizados correctamente`, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR PAGO');
    }
  }

/**
 * This function updates a mora payment record in a database and returns a success message or an error
 * message if the record is not found or if there is an internal server error.
 * @param {number} Id - The Id parameter is a number that represents the unique identifier of a mora
 * (late payment) in the database.
 * @param {UpdateMoraPagoDto} updateMoraPagoDto - UpdateMoraPagoDto is a data transfer object (DTO)
 * that contains the updated information for a MoraPago entity. It is likely defined elsewhere in the
 * codebase and contains properties such as the amount of the payment, the date it was made, and any
 * notes or comments related to the payment
 * @returns an instance of the `HandleMora` class with a message indicating whether the update was
 * successful or not, and a boolean value indicating the success status. If the update was not
 * successful, the `HandleMora` instance will also contain an error message.
 */
  async updateMora(Id: number, updateMoraPagoDto: UpdateMoraPagoDto) {
    try {
      const existMoraPago = await this.moraModel.findOneBy({ Id });
      if(!existMoraPago){
        throw new NotFoundException(`La mora con el Id ${Id} no encontrada`);
      }
      const { affected } = await this.moraModel.update(Id, updateMoraPagoDto);
      if(affected==0) return new HandleMora(`Ningúna mora sin afecta`, false, null);
      return new HandleMora(`La mora del estudiante fue actualizada correctamente`, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR MORA');
    }
  }

  /**
   * This function deletes a mora payment by its ID and returns a success message or throws an error if
   * the mora payment is not found or there is an internal server error.
   * @param {number} Id - The parameter `Id` is a number representing the unique identifier of a mora
   * (late payment) that needs to be deleted from the database.
   * @returns an instance of the `HandleMora` class with a message indicating whether the mora was
   * successfully deleted or not, and a boolean value indicating the success status. If the mora was
   * not found, a `NotFoundException` is thrown. If there is an error during the deletion process, an
   * `InternalServerErrorException` is thrown.
   */
  async deleteMora(Id: number) {
    try {
      const existMoraPago = await this.moraModel.findOneBy({ Id });
      if(!existMoraPago){
        throw new NotFoundException(`La mora con el Id ${Id} no encontrada`);
      }
      const { affected } = await this.moraModel.update(Id,{ EstadoMora: false });
      if(affected==0) return new HandleMora(`Ningúna mora sin afecta`, false, null);
      return new HandleMora(`La mora del estudiante fue eliminada correctamente`, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ELIMINAR MORA');
    }
  }

  /**
   * This is an async function that removes a payment by its ID and returns a message indicating
   * whether the operation was successful or not.
   * @param {number} Id - The parameter `Id` is a number representing the unique identifier of a
   * payment record that needs to be removed from the database.
   * @returns The `remove` function is returning an instance of the `HandlePago` class with a message
   * indicating whether the payment with the given `Id` was successfully deleted or not. If the payment
   * is not found, the function returns a message indicating that the payment was not found. If there
   * is an error during the deletion process, the function throws an `InternalServerErrorException`.
   */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ELIMINAR MENSUALIDAD');
    }
  }

  /* The above code is a TypeScript function that runs automatically at 12:15 AM every day in the
  "America/Lima" timezone. It inserts a new record into the "mora" table with the
  "estudianteEnGrupoId", "grupoModuloId", "MontoMora", "Verificado", and "EstadoMora" fields. The
  values for these fields are obtained by selecting data from various tables using a complex SQL
  query. The function uses a query runner to connect to the database, start a transaction, execute
  the query, commit the transaction if successful, and release the */
  @Cron('0 15 0 * * *', { timeZone:'America/Lima' })
  async registrarMorasAutomatico(){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`
      INSERT INTO mora (estudianteEnGrupoId, grupoModuloId, MontoMora, Verificado, EstadoMora)
      SELECT estudiante_en_grupo.Id, grupo_modulo.Id, grupo.MontoMora, false, true
      FROM estudiante
      INNER JOIN matricula on matricula.estudianteId = estudiante.Id
      INNER JOIN estudiante_en_grupo ON estudiante.Id = estudiante_en_grupo.estudianteId
      INNER JOIN grupo ON estudiante_en_grupo.grupoId = grupo.Id
      INNER JOIN grupo_modulo ON grupo.Id = grupo_modulo.grupoId
      WHERE matricula.EstadoMatricula = 'matriculado' and
      		grupo_modulo.CurrentModulo = true and
            grupo.Estado != false AND grupo.AplicaMora = true AND 
            grupo.estadoGrupoId != 3 AND 
            estudiante_en_grupo.Estado != false AND 
            DATEDIFF(CURDATE(), grupo_modulo.FechaPago) > grupo.NumDiasHolaguraMora AND
            NOT EXISTS (
              SELECT * FROM mora
              WHERE mora.grupoModuloId = grupo_modulo.Id AND mora.estudianteEnGrupoId = estudiante_en_grupo.Id
            ) AND
            NOT EXISTS (
              SELECT * FROM pago
              WHERE pago.grupoModuloId = grupo_modulo.Id AND pago.Verificado IS NOT NULL AND pago.CodigoVoucher IS NOT NULL AND pago.CodigoVoucher <> '' AND (pago.Estado IS NULL OR pago.Estado != 0) AND
              pago.estudianteEnGrupoId = estudiante_en_grupo.Id AND pago.grupoModuloId = grupo_modulo.Id
            );
      `);
      await queryRunner.commitTransaction();
      console.log("REGISTRO DE MORAS ACTUALIZADO")
    } catch (e) {
      console.log(e.message)
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('ERROR REGISTRO MORA AUTOMATICO');
    } finally {
      await queryRunner.release();
    }
  }

}
