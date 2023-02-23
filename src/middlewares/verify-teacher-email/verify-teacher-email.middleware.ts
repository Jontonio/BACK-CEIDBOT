import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class VerifyTeacherEmailMiddleware implements NestMiddleware {

  constructor(private _teacher:TeacherService){}

  async use(req: Request, res: Response, next: () => void) {

    const { Email } = req.body;
    
    const teacher = await this._teacher.getTeacherWithEmail(Email);

    if(teacher){
      return res.json({msg:`El email ${teacher.Email} del docente ya está registrado`, ok:false, data:''})
    }
    
    next();
  }

}
