import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { PasswordUsuarioDto } from './dto/password-usuario.dto';
import { UpdateUserDto } from './dto/update-usuario.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Usuario } from './entities/usuario.entity';
import { comparePassword, hashPassword } from 'src/helpers/hashPassword';
import { ReniecUsuarioDto } from './dto/usuario-reniec.dto';
import { Person } from 'src/interfaces/Person';
import { EnableUserDto } from './dto/enable-usuario.dto';
import axios from 'axios';
import { HandleUsuario } from 'src/class/global-handles';

@Injectable()
export class UsuarioService {

  constructor(@InjectRepository(Usuario) 
              private userModel:Repository<Usuario>){}

  /**
   * This function creates a new user and hashes their password before saving it to the database.
   * @param {CreateUsuarioDto} createUserDto - CreateUsuarioDto is an object that contains the data
   * needed to create a new user. It likely includes properties such as name, email, password, and
   * other user information. The function is using this object to create a new user in the database and
   * returns a HandleUsuario object with a success message and the
   * @returns The `create` function returns an instance of the `HandleUsuario` class with a success
   * message, a boolean value indicating success, and the newly created user object as its properties.
   */
  async create(createUserDto: CreateUsuarioDto) {
    try {
      /** hash password */
      const password = String(createUserDto.DNI);
      createUserDto.Password = hashPassword(password);
      const usuario = await this.userModel.save(createUserDto);
      return new HandleUsuario(`Usuario ${usuario.Nombres} registrado correctamente`, true, usuario);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR REGISTRO USUARIO');
    }
  }

  /**
   * This function finds all active users with pagination and their associated roles.
   * @param {PaginationQueryDto}  - - `limit`: The maximum number of records to return in the query
   * result.
   * @returns The `findAll` method is returning an instance of the `HandleUsuario` class with a
   * message, a boolean value indicating success or failure, an array of user objects, and a count of
   * the total number of users that meet the criteria specified in the method.
   */
  async findAll({limit, offset}:PaginationQueryDto) {

    try {
      const count = await this.userModel.countBy({ Estado:true });
      const usuarios = await this.userModel.find({
        where:{ Estado:true }, 
        skip:offset, take:limit,
        order: { createdAt:'DESC' },
        relations:['rol']
        });
      return new HandleUsuario(`Lista de usuarios`, true, usuarios, count);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER USUARIOS');
    }
  }

  async findOne(Id: number) {
    try {
      const usuario = await this.userModel.findOne({
        where:{ Id },
        relations:['rol']
      });
      return new HandleUsuario(`Usuario con Id ${Id} consultado correctamente`, true, usuario);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER UN USUARIO');
    }
  }

  /**
   * This is an async function that updates a user's information in a database and returns a success
   * message or an error message if the update fails.
   * @param {number} Id - The Id parameter is a number that represents the unique identifier of a user
   * in the system.
   * @param {UpdateUserDto} updateUserDto - UpdateUserDto is likely an object containing the updated
   * user information, such as their name, email, password, etc. It is used as the second parameter in
   * the update method of the userModel to update the user with the specified Id.
   * @returns an instance of the `HandleUsuario` class with a message indicating whether the user was
   * updated successfully or not, and a boolean value indicating the success status. If the `affected`
   * value is 0, the message will indicate that the user was not affected. If an error occurs during
   * the update process, the function will throw an `InternalServerErrorException`.
   */
  async update(Id: number, updateUserDto: UpdateUserDto) {
    try {
      const { affected } = await this.userModel.update(Id, updateUserDto);
      if(affected==0) return new HandleUsuario(`Usuario sin afectar`, false, null);
      const { Nombres } = await this.userModel.findOneBy({Id});
      return new HandleUsuario(`Usuario ${Nombres} actualizado correctamente`, true, null);
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR ACTUALIZAR USUARIO');
    }
  }

  /**
   * This function updates the reset password token for a user with a given email.
   * @param {string} Email - A string representing the email of the user whose reset password token
   * needs to be updated.
   * @param {string} ResetPasswordToken - ResetPasswordToken is a string parameter that represents the
   * token generated for resetting the password of a user. This token is used to verify the identity of
   * the user and allow them to reset their password securely.
   * @returns The `updateByEmailResetToken` function is returning the result of the `update` method
   * called on the `userModel` object, which updates the user with the specified email by setting their
   * reset password token to the provided value. The function is using `await` to wait for the update
   * operation to complete before returning the result.
   */
  async updateByEmailResetToken(Email: string, ResetPasswordToken: string) {
    try {
      return await this.userModel.update({ Email }, { ResetPasswordToken });
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR ACTUALIZAR TOKEN RESET USUARIO');
    }
  }

  /**
   * This is an async function that removes a user by updating their "Estado" property to false and
   * returns a success message with the user's name if the update was successful.
   * @param {number} Id - The parameter `Id` is a number representing the unique identifier of a user
   * that needs to be removed from the database.
   * @returns The `remove` function returns an instance of the `HandleUsuario` class with a message
   * indicating whether the user was successfully deleted or not, a boolean value indicating the
   * success status, and a null value for the data property. If an error occurs during the deletion
   * process, an `InternalServerErrorException` is thrown.
   */
  async remove(Id: number) {
    try {
      const { affected } = await this.userModel.update(Id,{ Estado:false });
      if(affected==0) return new HandleUsuario(`Usuario sin afectar`, false, null);
      const { Nombres } = await this.userModel.findOneBy({Id});
      return new HandleUsuario(`Usuario ${Nombres} eliminado correctamente`, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR DELETE USUARIO');
    }
  }

  /**
   * This is an async function that updates a user's enable status and returns a message indicating
   * whether the update was successful or not.
   * @param {number} Id - The ID of the user to be enabled or disabled.
   * @param {EnableUserDto} enableUserDto - EnableUserDto is a data transfer object (DTO) that contains
   * information about whether a user should be enabled or disabled. It likely has a boolean property
   * called "Habilitado" (which means "enabled" in Spanish) that determines whether the user should be
   * enabled or disabled.
   * @returns an object of type `HandleUsuario` with a message, a boolean value indicating if the
   * operation was successful, and a null value for any errors.
   */
  async enable(Id: number, enableUserDto:EnableUserDto) {
    try {
      const { affected } = await this.userModel.update(Id, enableUserDto);
      let msg = '';
      if(affected==0) return { data:'null', ok:false, msg:'Usuario sin afectar'};
      const { Nombres } = await this.userModel.findOneBy({Id});
      msg = enableUserDto.Habilitado?`Usuario ${Nombres} habilitado correctamente`:`Usuario ${Nombres} inhabilitado correctamente`;
      return new HandleUsuario(msg, true, null);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR HABILITAR USUARIO');
    }
  }

  /**
   * This is an asynchronous function that finds a user by their email and returns their information
   * along with their role.
   * @param {string} Email - A string representing the email address of the user to be found in the
   * database.
   * @returns The `findOneByEmail` function is returning a Promise that resolves to the result of
   * calling the `findOne` method on the `userModel` object with the provided `Email` parameter as the
   * value for the `where` clause. The `relations` option is also included to specify that the `rol`
   * relation should be loaded along with the user data. If an error occurs during the execution of the
   */
  async findOneByEmail(Email:string){
    try {
      return await this.userModel.findOne({
        where:{ Email },
        relations:['rol']
      });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ENCONTRAR USUARIO POR EMAIL');
    }
  }

  /**
   * This is an asynchronous function that finds a user by their DNI (identification number) and
   * returns the user object with their associated role.
   * @param {string} DNI - DNI stands for "Documento Nacional de Identidad" which is a unique
   * identification number assigned to individuals in some countries, such as Spain and Argentina. In
   * this case, it is a string parameter used to search for a user in the database by their DNI.
   * @returns The `findOneByDNI` function is returning a Promise that resolves to the result of calling
   * the `findOne` method on the `userModel` object with the provided `DNI` parameter as the value for
   * the `where` clause. The `relations` option is also included to eagerly load the associated `rol`
   * entity. If successful, the function returns the found user object. If an
   */
  async findOneByDNI(DNI:string){
    try {
      return await this.userModel.findOne({
        where:{ DNI },
        relations:['rol']
      });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER USUARIO POR DNI');
    }
  }

  /**
   * This is an asynchronous function that finds a user by their ID and returns their information along
   * with their role.
   * @param {number} Id - The parameter "Id" is a number that represents the unique identifier of a
   * user in the database. The function "findOneByID" uses this parameter to search for a user in the
   * database and returns the user object along with its associated "rol" (role) object. If the search
   * fails, the
   * @returns The `findOneByID` function is returning a Promise that resolves to the result of a
   * database query to find a user by their `Id` and include their associated `rol` (role) data. If the
   * query is successful, the function returns the user object. If there is an error, the function logs
   * the error message and throws an `InternalServerErrorException` with a custom error message.
   */
  async findOneByID(Id: number) {
    try {
      return await this.userModel.findOne({
        where:{ Id },
        relations:['rol']
      });
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException('ERROR OBTENER UN USUARIO');
    }
  }

  /**
   * This is an async function that updates the access date of a user in a database using their ID.
   * @param {number} Id - The parameter `Id` is a number that represents the unique identifier of a
   * user in the system. It is used to identify the user whose access date needs to be updated.
   * @returns the result of the update operation on the user model for the specified Id, which is being
   * awaited.
   */
  async updateAccessDateUser(Id:number){
    try {
      const FechaAcceso = new Date();
      return await this.userModel.update(Id,{ FechaAcceso });
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR USUARIO FECHA ACCESO');
    }
  }

/**
 * This is an async function that queries the RENIEC database for user information using a given DNI
 * (National Identity Document) and returns a HandleUsuario object with the results.
 * @param {ReniecUsuarioDto} dniDto - ReniecUsuarioDto, which is an object containing the DNI
 * (Documento Nacional de Identidad) of a user.
 * @returns The function `queryReniec` returns a `HandleUsuario` object that contains information about
 * the success or failure of the query and the data retrieved from the query. If there is an error, the
 * function throws an `InternalServerErrorException`.
 */
  async queryReniec(dniDto: ReniecUsuarioDto){
    const urlBase = process.env.URL_SUNAT;
    try {
      const response = await axios.post(`${urlBase}${dniDto.DNI}`);
      if(response.data.error){
          return new HandleUsuario(response.data.error, false, null);
      }
      const data = new Person(dniDto.DNI as string, 
                              response.data.nombreSoli, 
                              response.data.apePatSoli, 
                              response.data.apeMatSoli);
      return new HandleUsuario(`Datos encontrados para el DNI ${dniDto.DNI}`, true, data);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR CONSULTA RENIEC');
    }
  }

  /**
   * This is an async function that updates a user's password and returns a HandleUsuario object with a
   * success message or an error message.
   * @param {number} Id - The ID of the user whose password needs to be updated.
   * @param {PasswordUsuarioDto} passUsuarioDto - PasswordUsuarioDto is a data transfer object that
   * contains the current password, new password, and repeated new password entered by the user for
   * updating their password.
   * @returns an instance of the `HandleUsuario` class with a message and a boolean value indicating
   * whether the password update was successful or not, and a `null` value for the data property.
   */
  async updatePassword(Id :number, passUsuarioDto:PasswordUsuarioDto){
    try {

      const { CurrentPassword, NewPassword, RepeatPassword } = passUsuarioDto;
      const usuario  = await this.userModel.findOneBy({Id});

      if(!comparePassword(CurrentPassword, usuario.Password)){
        return new HandleUsuario(`Digite bien su contraseña actual`, false, null);
      }
      if(NewPassword!==RepeatPassword){
        return new HandleUsuario(`Las contraseñas nuevas no son iguales`, false, null);
      }

      const Password = hashPassword(NewPassword);
      const { affected } = await this.userModel.update(Id, { Password });

      if(affected==0) return new HandleUsuario(`Actualización de password sin afectar`, false, null);
      return new HandleUsuario(`Contraseña actualizada correctamente`, true, null);

    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR PASSWORD');
    }
  }

}
