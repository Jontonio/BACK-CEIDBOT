import { Injectable, 
         NestMiddleware, 
         NotFoundException,
         InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CursoService } from 'src/curso/curso.service';

@Injectable()
export class VerifyIdCursoMiddleware implements NestMiddleware {

  constructor(private _curso:CursoService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { id } = req.params;
      const curso = await this._curso.getOneById(+id);
      if(!curso){
        throw new NotFoundException(`El curso con Id ${id} no existe`);
      }
      next();
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException(e.response);
    }
  }
}
