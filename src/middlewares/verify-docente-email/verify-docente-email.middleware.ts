import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { DocenteService } from 'src/docente/docente.service';

@Injectable()
export class VerifyDocenteEmailMiddleware implements NestMiddleware {

  constructor(private _docente:DocenteService){}

  async use(req: Request, res: Response, next: () => void) {

    const { Email } = req.body;
    
    const docente = await this._docente.getDocenteWithEmail(Email);

    if(docente){
      return res.json({msg:`El email ${docente.Email} del docente ya está registrado`, ok:false, data:''})
    }
    
    next();
  }

}
