import { Injectable } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { comparePassword } from 'src/helpers/hashPassword';
import { compareToken, generateToken } from 'src/helpers/token';
import { LoginUser, ResLogin } from 'src/interfaces/ResLogin'
import { Payload } from 'src/interfaces/Payload';
import { LogoutAuthDto } from './dto/logout-auth.dto';

@Injectable()
export class AuthService {

  constructor(private _user:UsuarioService){}

  async login(createAuthDto:CreateAuthDto) {

    const { Email, Password } = createAuthDto;

    //Verify if exists user
    const user = await this._user.findOneByEmail(Email);

    if(!user){
      return new ResLogin(`Email y/o password son incorrectos`, false, null, null);
    }
    //Verify the enable user
    if(!user.Habilitado){
      return new ResLogin(`Usuario inhabilitado, comuniquese con el administrador`, false, null, null);
    }
    //Verify the enable user
    if(!user.Estado){
      return new ResLogin(`Email y/o password son incorrectos`, false, null, null);
    }
    //Verify the password
    if(!comparePassword(Password, user.Password)){
      return new ResLogin(`Email y/o password son incorrectos`, false, null, null);
    }

    //Generate token
    const payload:Payload = {
      Email:user.Email,
      Nombres:user.Nombres,
      ApellidoPaterno:user.ApellidoPaterno
    }

    const token = generateToken(payload); 
    // Generate payload user
    const resUser: LoginUser = {
      Id:user.Id, 
      Nombres:user.Nombres, 
      ApellidoPaterno:user.ApellidoPaterno
    }
    
    return new ResLogin(`Bienvenido ${user.Nombres} al sistema CIEDBOT`, true, token, resUser);

  }

  async logout(logoutDto: LogoutAuthDto) {
    
    //? TODO: Actualizar fecha última de accesso
    console.log(logoutDto);
    const res = await this._user.updateAccessDateUser(logoutDto.Id);
    return { msg:"Sesión cerrada correctamente", status:200, ok:true};
  }
  
  async authenticated(token:string){

    try {

      const data:any = compareToken(token);
      const payload:Payload = data.payload;
      const { Id, 
              Nombres, 
              ApellidoPaterno, 
              ApellidoMaterno, 
              Email, 
              rol 
            } = await this._user.findOneByEmail(payload.Email);

      return new ResLogin(`Usuario ${Nombres} verificado`, 
                          true,
                          token, 
                          {Id, Nombres, ApellidoPaterno, ApellidoMaterno, Email, TipoRol:rol.TipoRol })
    } catch(err) {

      return new ResLogin(err.message, false, token, null)
      
    }
    
  }
  
}
