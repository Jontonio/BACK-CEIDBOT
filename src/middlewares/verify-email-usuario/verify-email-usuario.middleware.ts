import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class VerifyEmailUsuarioMiddleware implements NestMiddleware {

  constructor(private _userService:UsuarioService){}

  async use(req: Request, res: Response, next: () => void) {

    const { Email } = req.body;

    const usuario = await this._userService.findOneByEmail(Email);
  
    if(usuario){
      return res.json({msg:`El email ${Email} del usuario ya se encuentra registrado`, ok:false, data:''})
    }

    next();
  }
}
