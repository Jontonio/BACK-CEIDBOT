import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { GrupoService } from 'src/grupo/grupo.service';

@Injectable()
export class VerifyIdGrupoMiddleware implements NestMiddleware {

  constructor(private _grupo:GrupoService){}

  async use(req: Request, res: Response, next: () => void) {
    const { id } = req.params;
    const grupo = await this._grupo.getOneById(+id);
    if(!grupo){
      return res.json({msg:`El grupo con Id ${id} no existe`, ok:false, data:''})
    }
    next();
  }
}
