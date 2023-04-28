import { Controller, Post, Body, Get, Req, Patch } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { RequestResetPasswordDto } from './dto/reset-password.dto';
import { RequestChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto){
    return this.authService.login(createAuthDto);
  }

  @Post('logout')
  logout(@Body() logoutDto: LogoutAuthDto){
    return this.authService.logout(logoutDto);
  }

  @Get('user-authenticated')
  authenticated(@Req() req:Request){   
    return this.authService.authenticated(req);    
  }

  @Patch('reset-password')
  resetPassword(@Body() requestResetPasswordDto:RequestResetPasswordDto){
    return this.authService.resetPassword(requestResetPasswordDto);
  }

  @Patch('change-password')
  changePassword(@Body() requestChangePasswordDto:RequestChangePasswordDto){
    return this.authService.changePassword(requestChangePasswordDto);
  }
  
}
