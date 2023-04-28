import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { comparePassword, hashPassword } from 'src/helpers/hashPassword';
import { compareToken, generateToken } from 'src/helpers/token';
import { Payload } from 'src/interfaces/Payload';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { Login } from 'src/interfaces/Login';
import { HandleLogin, HandleLogout, HandleResetPassword } from 'src/class/global-handles';
import { Request } from 'express';
import { RequestResetPasswordDto } from './dto/reset-password.dto';
import { NodeMailer } from 'src/helpers/nodeMailer';
import { MailerService } from '@nestjs-modules/mailer';
import { RecuperarCuenta } from './class/RecuperarCuenta';
import { RequestChangePasswordDto } from './dto/change-password.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {

  constructor(
              @InjectRepository(Usuario) 
              private userModel:Repository<Usuario>,
              private mailService: MailerService,
              private _user:UsuarioService ){}

  async login(createAuthDto:CreateAuthDto) {
    try {
      const { Email, Password } = createAuthDto;
      //Verify if exists user
      const user = await this._user.findOneByEmail(Email);
      if(!user){
        return new HandleLogin(`Email y/o password son incorrectos`, false, null, null);
      }
      //Verify the enable user
      if(!user.Habilitado){
        return new HandleLogin(`Usuario inhabilitado, comuniquese con el administrador`, false, null, null);
      }
      //Verify the enable user
      if(!user.Estado){
        return new HandleLogin(`Email y/o password son incorrectos`, false, null, null);
      }
      //Verify the password
      if(!comparePassword(Password, user.Password)){
        return new HandleLogin(`Email y/o password son incorrectos`, false, null, null);
      }
      //Generate token
      const payload:Payload = {
        Email:user.Email,
        Nombres:user.Nombres,
        ApellidoPaterno:user.ApellidoPaterno
      }
      const token = generateToken(payload); 
      // Generate payload user
      const respLogin: Login = {
        Id:user.Id, 
        Nombres:user.Nombres, 
        ApellidoPaterno:user.ApellidoPaterno,
        ApellidoMaterno:user.ApellidoMaterno
      }

      return new HandleLogin(`Bienvenido ${user.Nombres} al sistema CIEDBOT`, true, token, respLogin);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_LOGIN');
    }
  }

  async logout(logoutDto: LogoutAuthDto) {
    try {
      await this._user.updateAccessDateUser(logoutDto.Id);
      return new HandleLogout('Sesión cerrada correctamente', true, null);
    } catch (error) {
      throw new InternalServerErrorException('ERROR_LOGOUT');
    }
  }
  
  async authenticated(req:Request){
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const data:any = compareToken(token);
      const payload:Payload = data.payload;
      const { Id, Nombres, ApellidoPaterno, ApellidoMaterno, Email, rol, DNI, Celular, Direccion } = await this._user.findOneByEmail(payload.Email);
      const usuario = new Login(Id, Nombres, ApellidoPaterno, ApellidoMaterno, Email, rol.TipoRol, DNI, Celular, Direccion)
      return new HandleLogin(`Usuario ${Nombres} verificado`, true, token, usuario );
    } catch(err) {
      return new InternalServerErrorException("ERROR GET AUTHENTICATED USER");
    }
  }

  async resetPassword(requestResetPasswordDto:RequestResetPasswordDto){
    try {
      /** buscar al usuario con el ese email */
      const { Email } = requestResetPasswordDto;
      const user = await this._user.findOneByEmail(Email);
      if(!user){
        return new HandleResetPassword('Dirección no es válida, no es un correo electrónico principal verificado o no está asociada con una cuenta de usuario personal.', false, null);
      }
      /** actualizar token de resetPassword */
      const uui = uuidv4();
      await this._user.updateByEmailResetToken(Email, uui );
      /** Send email module  */
      const nodeMailer = new NodeMailer(this.mailService);
      const infoRecuperar = new RecuperarCuenta(process.env.URL_FRONT_RESET_PASS, uui, user.Nombres );
      const res = await nodeMailer.sendEmailResetPassword(Email, infoRecuperar);
      console.log(res)
      return new HandleResetPassword('Mensaje enviado correctamente', true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException("ERROR RESET PASSWORD");
    }
  }

  async changePassword(requestChangePasswordDto:RequestChangePasswordDto){
    try {
      /** buscar al usuario con el ese email */
      const { NewPassword, RepeatPassword, ResetPasswordToken } = requestChangePasswordDto;

      /** verificar si las contraseñas son iguales */
      if(NewPassword!==RepeatPassword){
        return new HandleResetPassword('Las contraseñas no coinciden, verifique que ambas contraseñas sean iguales', false, null);
      }

      /** buscar al usuario con el token recibido */
      const usuario = await this.userModel.findOneBy({ ResetPasswordToken });

      if(!usuario){
        return new HandleResetPassword('Credenciales incorrectas o vencidas.', false, null);
      }
      /** cifrar la contraseña */
      const Password = hashPassword(NewPassword);
      /** actualizar el password del usuario */
      const resUpdate = await this.userModel.update({ResetPasswordToken},{ Password, ResetPasswordToken:null});
      console.log(resUpdate)

      return new HandleResetPassword('Nueva contraseña registrada correctamente', true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException("ERROR RESET PASSWORD");
    }
  }
  
}
