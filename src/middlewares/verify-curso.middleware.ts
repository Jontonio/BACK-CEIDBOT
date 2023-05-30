import { Injectable, NestMiddleware, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CursoService } from 'src/curso/curso.service';

@Injectable()
export class VerifyCursoMiddleware implements NestMiddleware {

  constructor(private _curso:CursoService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { NombreCurso, nivel } = req.body;
      const idioma = await this._curso.findByName(NombreCurso, nivel.Nivel);
      if(idioma.length!=0){
        return res.json({msg:`El idioma ${ NombreCurso.toUpperCase() } de nivel ${ nivel.Nivel } ya se encuntra registrado`, ok:false, data: null})
      }
      next();
    } catch (e) {
      console.log(e.message);
      throw new InternalServerErrorException(e.response);
    }
  }
}
