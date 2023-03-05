import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { DocenteService } from 'src/docente/docente.service';

@Injectable()
export class VerifyDocenteDocMiddleware implements NestMiddleware {

  constructor(private _docente:DocenteService){}

  async use(req: Request, res: Response, next: () => void) {

    const { Documento } = req.body;
    
    const teacher = await this._docente.getDocenteWithDocument(Documento);

    if(teacher){
      return res.json({msg:`El ${teacher.TipoDocumento} ${teacher.Documento} del docente ${teacher.Nombres} ya se encuentra registrado`, ok:false, data:''})
    }

    next();
  }
  
}
