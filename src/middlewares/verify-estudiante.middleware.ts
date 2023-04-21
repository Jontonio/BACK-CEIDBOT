import { Injectable, NestMiddleware, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { EstudianteService } from 'src/estudiante/estudiante.service';

@Injectable()
export class VerifyEstudianteMiddleware implements NestMiddleware {

  constructor(private _estudiante:EstudianteService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { Documento, TipoDocumento } = req.body;
      const estudiante = await this._estudiante.findOneByDocumentoInternal(Documento, TipoDocumento);
      if(!estudiante){
        return res.json({msg:`El ${TipoDocumento} ${Documento} no se encuentra registrado como estudiante en el CEID`, ok:false, data: null})
      }
      next();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.response);
    }
  }
}
