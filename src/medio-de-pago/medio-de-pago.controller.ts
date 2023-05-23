import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { MedioDePagoService } from './medio-de-pago.service';
import { CreateMedioDePagoDto } from './dto/create-medio-de-pago.dto';
import { UpdateMedioDePagoDto } from './dto/update-medio-de-pago.dto';

@Controller('medio-de-pago')
export class MedioDePagoController {
  constructor(private readonly medioDePagoService: MedioDePagoService) {}

  @Post('register-medio-pago')
  create(@Body() createMedioDePagoDto: CreateMedioDePagoDto) {
    return this.medioDePagoService.create(createMedioDePagoDto);
  }

  @Patch('update-medio-pago/:id')
  update(@Param('id') id:string ,@Body() updateMedioDePagoDto: UpdateMedioDePagoDto) {
    return this.medioDePagoService.update(+id, updateMedioDePagoDto);
  }

  @Delete('delete-medio-pago/:id')
  delete(@Param('id') id:string) {
    return this.medioDePagoService.delete(+id);
  }

  @Get('get-all-medios-pago')
  findAll() {
    return this.medioDePagoService.findAll();
  }

}
