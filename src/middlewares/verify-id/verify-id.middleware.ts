import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VerifyIdMiddleware implements NestMiddleware {

  constructor(private _userService:UserService){}

  async use(req: Request, res: Response, next: () => void) {

    const { id } = req.params;
    
    if(id){
      const existUser = await this._userService.findOne(+id);
      if(!existUser) return res.json({msg:`El usuario con id ${id} no existe`})
    }

    next();
  }
}
