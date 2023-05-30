import { Injectable, NestMiddleware, InternalServerErrorException} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class VerifyDniUsuarioMiddleware implements NestMiddleware {

  constructor(private _userService:UsuarioService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      //update usuario
      if(req.params.DNI){ 
        const usuario = await this._userService.findOneByDNI(req.params.DNI);
        if(!usuario){
          return res.json({msg:`El DNI ${req.params.DNI} no se encuentra registrado`, ok:false, data: null});
        }
        console.log("ok")
        next();
      }
      // create usuario
      const { DNI } = req.body;
      const usuario = await this._userService.findOneByDNI(DNI);
      if(usuario) return res.json({msg:`El DNI ${DNI} ya se encuentra registrado, registre uno nuevo`, ok:false, data: null});
      next();

    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException(e);
    }
  }
}
