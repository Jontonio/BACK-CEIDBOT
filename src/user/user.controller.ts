import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ReniecUserDto } from './dto/user-reniec.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('user-reniec')
  userReniec(@Body() dniDto: ReniecUserDto) {
    return this.userService.queryReniec(dniDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.userService.findAll(pagination);
  }

  @Get('get-one-user/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('create-fake-user')
  createFakeUser(){
    return this.userService.fakeCreateDataUser();
  }
}
