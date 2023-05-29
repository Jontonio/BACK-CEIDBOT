import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUserDto } from './dto/update-usuario.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ReniecUsuarioDto } from './dto/usuario-reniec.dto';
import { EnableUserDto } from './dto/enable-usuario.dto';
import { PasswordUsuarioDto } from './dto/password-usuario.dto';
import { Response } from 'express';

@Controller('usuario')
export class UserController {
  constructor(private readonly userService: UsuarioService) {}

  @Post('add-usuario')
  create(@Body() createUserDto: CreateUsuarioDto) {
    return this.userService.create(createUserDto);
  }

  @Post('usuario-reniec')
  userReniec(@Body() dniDto: ReniecUsuarioDto) {
    return this.userService.queryReniec(dniDto);
  }

  @Get('get-usuarios')
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.userService.findAll(pagination);
  }

  @Get('get-one-usuario/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('update-usuario/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('update-password-usuario/:id')
  updatePassword(@Param('id') id: string, @Body() passwordUsuarioDto: PasswordUsuarioDto) {
    return this.userService.updatePassword(+id, passwordUsuarioDto);
  }

  @Patch('enable-usuario/:id')
  enable(@Param('id') id: string, @Body() enableUserDto: EnableUserDto) {
    return this.userService.enable(+id, enableUserDto);
  }

  @Delete('delete-usuario/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  
}
