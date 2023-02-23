import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto){
    return this.authService.login(createAuthDto);
  }

  @Get('logout')
  logout(){
    return this.authService.logout();
  }

  @Get('user-authenticated')
  authenticated(@Req() req:Request){
    if(req){
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      return this.authService.authenticated(token);
    }else{
      return {msg:'Sin token'}
    }
  }
}
