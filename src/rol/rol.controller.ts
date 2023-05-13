import { Controller, Get, Post, Body} from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';

@Controller('rol')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  @Get()
  findAll() {
    return this.rolService.findAll();
  }

}
