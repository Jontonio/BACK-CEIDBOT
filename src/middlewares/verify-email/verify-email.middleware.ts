import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VerifyUserMiddleware implements NestMiddleware {

  constructor(private _userService:UserService){}

  async use(req: Request, res: Response, next: () => void) {

    const { Email } = req.body;

    if(Email){
      const existUser = await this._userService.findOneByEmail(Email);
  
      if(existUser){
        return res.json({msg:`El usuario con el email ${Email} ya esta registrado`});
      }
    }

    next();
  }
}
