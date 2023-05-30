import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { compareToken } from 'src/helpers/token';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: () => void) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      compareToken(token);
      next();
    } catch(e) {
      console.log(e.message)
      throw new UnauthorizedException(e.message);
    }
  }
}
