import { Injectable, NestMiddleware, NotFoundException, InternalServerErrorException} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class VerifyIdUsuarioMiddleware implements NestMiddleware {

  constructor(private _userService:UsuarioService){}

  async use(req: Request, res: Response, next: () => void) {
    try {
      const { id } = req.params;
      const usuario = await this._userService.findOneByID(+id);
      if(!usuario){
        throw new NotFoundException(`El usuario con Id ${id} no existe`);
      }
      next();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e.response);
    }
  }
}
