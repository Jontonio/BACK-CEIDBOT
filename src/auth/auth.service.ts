import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { comparePassword } from 'src/helpers/hashPassword';
import { compareToken, generateToken } from 'src/helpers/token';
import { Payload } from 'src/interfaces/Payload';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { Login } from 'src/interfaces/Login';
import { HandleLogin, HandleLogout } from 'src/class/global-handles';

@Injectable()
export class AuthService {

  constructor(private _user:UsuarioService){}

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
  
  async authenticated(token:string){
    try {
      const data:any = compareToken(token);
      const payload:Payload = data.payload;
      const { Id, Nombres, ApellidoPaterno, ApellidoMaterno, Email, rol, DNI, Celular, Direccion } = await this._user.findOneByEmail(payload.Email);
      const usuario = new Login(Id, Nombres, ApellidoPaterno, ApellidoMaterno, Email, rol.TipoRol, DNI, Celular, Direccion)
      return new HandleLogin(`Usuario ${Nombres} verificado`, true, token, usuario );
    } catch(err) {
      return new HandleLogin(err.message, false, token, null);
    }
  }
  
}
