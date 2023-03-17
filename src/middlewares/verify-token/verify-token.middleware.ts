import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { compareToken } from 'src/helpers/token';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: () => void) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      compareToken(token);
    } catch(e) {
      return res.json({msg:"Acceso denegado - necesita un token de autorización", ok:false, e});
    }
    next();
  }
}
