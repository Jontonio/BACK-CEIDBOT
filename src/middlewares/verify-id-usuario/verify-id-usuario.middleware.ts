import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class VerifyIdUsuarioMiddleware implements NestMiddleware {

  constructor(private _userService:UsuarioService){}

  async use(req: Request, res: Response, next: () => void) {

    const { id } = req.params;
    
    const usuario = await this._userService.findOne(+id);

    if(!usuario){
      return res.json({msg:`El usuario con id ${id} no existe`, ok:false, data:''})
    }

    next();
  }
}
