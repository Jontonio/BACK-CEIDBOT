import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { comparePassword } from 'src/helpers/hashPassword';
import { compareToken, generateToken } from 'src/helpers/token';
import { LoginUser, ResLogin } from 'src/interfaces/ResLogin'
import { Payload } from 'src/interfaces/Payload';

@Injectable()
export class AuthService {

  constructor(private _user:UserService){}

  async login(createAuthDto:CreateAuthDto) {

    const { Email, Password } = createAuthDto;

    //Verify if exists user
    const user = await this._user.findOneByEmail(Email);

    if(!user){
      return new ResLogin(`Email y/o password son incorrectos`, false, null, null);
    }
    //Verify the password
    if(!comparePassword(Password, user.Password)){
      return new ResLogin(`Email y/o password son incorrectos`, false, null, null);
    }

    //Generate token
    const payload:Payload = {
      Email:user.Email,
      Name:user.Name,
      LastName:user.LastName
    }

    const token = generateToken(payload); 

    // Generate payload user
    const resUser: LoginUser = {
      Id:user.Id, 
      Name:user.Name, 
      FirstName:user.FirstName
    }
    
    return new ResLogin(`Bienvenido ${user.Name} al sistema CIEDBOT`, true, token, resUser);
  }

  logout() {
    return { msg:"Sesión cerrada correctamente", status:200, ok:true};
  }
  
  async authenticated(token:string){

    try {
      const data:any = compareToken(token);
      const payload:Payload = data.payload;
      const { Id, Name, FirstName, LastName, Email, role } = await this._user.findOneByEmail(payload.Email);
      return new ResLogin(`Usuario ${Name} verificado`, 
                          true,
                          token, 
                          {Id, Name, LastName, FirstName,Email, TypeRole:role.TypeRole })
    } catch(err) {
      return new ResLogin(err.message, false, token, null)
    }
    
  }
  
}
