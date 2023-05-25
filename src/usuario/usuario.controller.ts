import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUserDto } from './dto/update-usuario.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ReniecUsuarioDto } from './dto/usuario-reniec.dto';
import { EnableUserDto } from './dto/enable-usuario.dto';
import { PasswordUsuarioDto } from './dto/password-usuario.dto';
import * as XLSX from 'xlsx';
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

  @Get('/export')
  async exportExcel(@Res() res: Response, @Query() pagination: PaginationQueryDto) {

    const users = await this.userService.findAll(pagination); // Obtener los datos de la base de datos

    // Generar el archivo Excel utilizando SheetJS
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(Object.values(users.data));
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

     // Enviar el archivo Excel al cliente
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    return res.send(excelBuffer);
  }
  
}
