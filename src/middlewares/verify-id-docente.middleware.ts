import { Injectable, NestMiddleware, NotFoundException, InternalServerErrorException} from '@nestjs/common';
import { Request, Response } from 'express';
import { DocenteService } from 'src/docente/docente.service';

@Injectable()
export class VerifyIdDocenteMiddleware implements NestMiddleware {

  constructor(private _docente:DocenteService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { id } = req.params;
      const grupo = await this._docente.getOneById(+id);
      if(!grupo){
        throw new NotFoundException(`El docente con Id ${id} no existe`);
      }
      next();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.response);
    }
  }
}
