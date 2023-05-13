import { Injectable, 
         NestMiddleware, 
         NotFoundException,
         InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { GrupoService } from 'src/grupo/grupo.service';

@Injectable()
export class VerifyIdGrupoMiddleware implements NestMiddleware {

  constructor(private _grupo:GrupoService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { id } = req.params;
      const grupo = await this._grupo.getOneById(+id);
      if(!grupo){
        throw new NotFoundException(`El grupo con Id ${id} no existe`);
      }
      next();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.response);
    }
  }
}
