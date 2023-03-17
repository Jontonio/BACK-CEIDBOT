import { Injectable, NestMiddleware, InternalServerErrorException} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class VerifyDniUsuarioMiddleware implements NestMiddleware {

  constructor(private _userService:UsuarioService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { DNI } = req.body;
      const usuario = await this._userService.findOneByDNI(DNI);
      if(usuario){
        return res.json({msg:`El DNI ${usuario.DNI} ya se encuentra registrado, registre uno nuevo`, ok:false, data: null});
      } 
      next();
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException(e);
    }
  }
}
