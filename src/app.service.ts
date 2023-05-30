import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return JSON.stringify({version:'V1.0.0', msg:'WELCOME TO SERVER REST (CEIDBOT)'});
  }
}
