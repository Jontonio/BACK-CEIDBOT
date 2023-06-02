import { Controller, Get } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('lista-estudiantes-pago-categoria-modulo-grupo/:IdGrupo/:IdCategoriaPago/:Modulo')
  listaEstudiantesPagoCategoriaModuloGrupo(@Param('IdGrupo') IdGrupo:number, 
                                           @Param('IdCategoriaPago') IdCategoriaPago:number,
                                           @Param('Modulo') Modulo:number){
    return this.reportsService.listaEstudiantesConPagoGrupoModulo(IdGrupo, IdCategoriaPago, Modulo);
  }

  @Get('resumen-total-pagos-por-categoria-grupo/:anio/:numMes')
  resumenTotalPagosPorCategoriaGrupo(@Param('anio') anio:string, @Param('numMes') numMes:string){
    return this.reportsService.resumenTotalPagosPorCategoriaGrupo(anio, numMes);
  }

  @Get('reporte-pagos-otros-tipos/:anio/:numMes')
  reportePagosOtrosTipos(@Param('anio') anio:string, @Param('numMes') numMes:string){
    return this.reportsService.reportePagosOtrosTipos(anio, numMes);
  }

  @Get('indice-deuda-grupos-en-proceso/:grupoId')
  indiceDeudaGruposEnProceso(@Param('grupoId') grupoId:string){
    return this.reportsService.indiceDeudaGruposEnProceso(grupoId);
  }



}
