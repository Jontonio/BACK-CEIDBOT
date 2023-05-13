import { Injectable, NestMiddleware, InternalServerErrorException} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class VerifyEmailUsuarioMiddleware implements NestMiddleware {

  constructor(private _userService:UsuarioService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { Email } = req.body;
      const usuario = await this._userService.findOneByEmail(Email);
      if(usuario){
        return res.json({msg:`El email ${Email} ya se encuentra registrado, registre un nuevo email.`, ok:false, data: null});
      }
      next();
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException(e);
    }
  }
}
