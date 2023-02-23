import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class VerifyTeacherDocMiddleware implements NestMiddleware {

  constructor(private _teacher:TeacherService){}

  async use(req: Request, res: Response, next: () => void) {

    const { Documento } = req.body;
    
    const teacher = await this._teacher.getTeacherWithDocument(Documento);

    if(teacher){
      return res.json({msg:`El ${teacher.TipoDocumento} ${teacher.Documento} del docente ${teacher.Nombres} ya se encuentra registrado`, ok:false, data:''})
    }

    next();
  }
  
}
