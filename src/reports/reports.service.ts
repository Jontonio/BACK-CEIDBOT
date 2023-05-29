import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { jsPDF } from "jspdf";
import { join } from 'path';
import { DataHorizontalBar } from 'src/class/Graphics';
import { PaginationQueryDto } from 'src/usuario/dto/pagination-query.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class ReportsService {

  constructor(private dataSource: DataSource, 
              private _userService:UsuarioService){}

  async generateReportUser(pagination:PaginationQueryDto){
      
      const doc = new jsPDF('p');
      doc.text('Lista de usuarios activos',20,20);
      const listUsers = await this._userService.findAll(pagination);

      const headersUsers = ['idUser','name','lastName','email','isActive'];

      const data:any[] = [];

      // listUsers.data.forEach( res => {
      //     const user = { idUser:String(res.Id),
      //                    name: res.Nombres, 
      //                    lastName:res.ApellidoPaterno, 
      //                    email:res.Email,
      //                    isActive: 'yes'
      //                 }
      //     data.push(user)
      // });

      doc.table(20, 25, data, headersUsers,null);

      const baseURL  = '../public/';
      // const baseFile = `reports-user/${uuidv4()}.pdf`;
      const baseFile = `reports-user/mi-reporte.pdf`;

      const filePath = join(__dirname,`${baseURL}${baseFile}`);
      await doc.save(filePath);
      
      return {
          msg:'Rporte generado',
          url:`http://localhost:3000/${baseFile}`
      };
  }
  
  async listaEstudiantesConPagoGrupoModulo(IdGrupo:number, IdCategoriaPago:number, Modulo:number){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const res = await queryRunner.query(`
        SELECT grupo.Id as grupoId, estudiante.Nombres, estudiante.ApellidoPaterno, estudiante.ApellidoMaterno, categoria_pago.TipoCategoriaPago, medio_de_pago.MedioDePago, pago.MontoPago, pago.FechaPago, pago.CodigoVoucher ,modulo.Modulo  FROM estudiante
          INNER JOIN estudiante_en_grupo on estudiante.Id = estudiante_en_grupo.estudianteId
          INNER JOIN grupo on grupo.Id = estudiante_en_grupo.grupoId
          LEFT JOIN pago on estudiante_en_grupo.Id = pago.estudianteEnGrupoId
          LEFT JOIN categoria_pago on categoria_pago.Id = pago.categoriaPagoId
          LEFT JOIN medio_de_pago on medio_de_pago.Id = pago.medioDePagoId
          LEFT JOIN grupo_modulo on pago.grupoModuloId = grupo_modulo.Id
          LEFT JOIN modulo on grupo_modulo.moduloId = modulo.Id
          WHERE pago.Estado = 1 AND 
                pago.Verificado = 1 
                AND pago.categoriaPagoId = ${IdCategoriaPago}  AND 
                grupo.Id = ${IdGrupo} AND  
                (modulo.Modulo is null or modulo.Modulo = ${Modulo})
          GROUP BY estudiante_en_grupo.Id, modulo.Id;
        `);
        await queryRunner.commitTransaction();
        console.log("Reporte de grupos y pagos")
        return res;
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(e.message);
      } finally {
        await queryRunner.release();
      }
  }

  async resumenTotalPagosPorCategoriaGrupo(anio:string, numMes:string){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const res = await queryRunner.query(`
        SELECT grupo.Id as grupoId, 
              curso.NombreCurso, 
              nivel.Nivel, 
              SUM(pago.MontoPago) AS total_pago, 
              MONTH(pago.FechaPago) AS Num_mes, 
              categoria_pago.TipoCategoriaPago
        FROM pago
        INNER JOIN categoria_pago ON categoria_pago.Id = pago.categoriaPagoId
        LEFT JOIN estudiante_en_grupo ON pago.estudianteEnGrupoId = estudiante_en_grupo.Id
        LEFT JOIN grupo ON estudiante_en_grupo.grupoId = grupo.Id
        LEFT JOIN curso ON grupo.cursoId = curso.Id
        LEFT JOIN nivel ON nivel.Id = curso.nivelId
        WHERE pago.Estado = true AND pago.Verificado = true AND grupo.estadoGrupoId  BETWEEN 1 and 2 AND MONTH(pago.FechaPago)=${numMes} AND YEAR(pago.FechaPago)=${anio}
        GROUP BY categoria_pago.TipoCategoriaPago, grupo.Id
        ORDER BY grupo.Id;
        `);
        await queryRunner.commitTransaction();
        console.log("Reporte de resumen total por categoria y grupo")
        return res;
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(e.message);
      } finally {
        await queryRunner.release();
      }
  }

  async reportePagosOtrosTipos(anio:string, numMes:string){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const res = await queryRunner.query(`
        SELECT SUM(pago.MontoPago) AS total_pago, MONTH(pago.FechaPago) AS Num_mes, tipo_tramite.TipoTramite
          FROM pago
          INNER JOIN tramite on pago.Id = tramite.pagoId
          INNER JOIN tipo_tramite on tipo_tramite.Id = tramite.tipoTramiteId
          WHERE pago.Estado=true and pago.Verificado AND MONTH(pago.FechaPago)=${numMes} AND YEAR(pago.FechaPago)=${anio}
          GROUP BY tipo_tramite.TipoTramite;
        `);
        await queryRunner.commitTransaction();
        console.log("Reporte de otros pagos")
        return res;
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(e.message);
      } finally {
        await queryRunner.release();
      }
  }

  async indiceDeudaGruposEnProceso(grupoId:string){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const res = await queryRunner.query(`
        SELECT grupo_modulo.grupoId, 
               modulo.Modulo as modulo, 
               SUM(CASE WHEN categoria_pago.Id = 1 THEN pago.MontoPago ELSE 0 END) as total_pagado, SUM(denominacion_servicio.MontoPension) As total_a_pagar,
          (SUM(CASE WHEN categoria_pago.Id = 1 THEN pago.MontoPago ELSE 0 END) * 100) / SUM(denominacion_servicio.MontoPension) As indice_del_pago_actual, (100 - (SUM(CASE WHEN categoria_pago.Id = 1 THEN pago.MontoPago ELSE 0 END) * 100) / SUM(denominacion_servicio.MontoPension)) as indice_de_la_deuda_vencida
          FROM grupo_modulo
          INNER JOIN modulo ON modulo.Id = grupo_modulo.moduloId
          INNER JOIN pago ON grupo_modulo.Id = pago.grupoModuloId
          INNER JOIN categoria_pago ON categoria_pago.Id = pago.categoriaPagoId
          INNER JOIN estudiante_en_grupo ON pago.estudianteEnGrupoId = estudiante_en_grupo.Id
          INNER JOIN matricula ON estudiante_en_grupo.matriculaId = matricula.Id
          INNER JOIN denominacion_servicio ON denominacion_servicio.Id = matricula.denomiServicioId
          WHERE grupo_modulo.CurrentModulo = true and grupo_modulo.grupoId = ${grupoId}
          GROUP BY grupo_modulo.Id;
        `);
        await queryRunner.commitTransaction();
        console.log("Reporte del índice de la deuda")
        if(res.length > 0){
          const total:DataHorizontalBar[] = [];
          const indice:DataHorizontalBar[] = [];
          total.push({name:`Pagado módulo ${res[0].modulo}`, value:res[0].total_pagado},
                     {name:`Por pagar módulo ${res[0].modulo}`, value:res[0].total_a_pagar})
          indice.push({name:`Porcentaje pago módulo ${res[0].modulo}`, value:res[0].indice_del_pago_actual},
                      {name:`Porcentaje deuda vencida módulo ${res[0].modulo}`, value:res[0].indice_de_la_deuda_vencida})
          return { total, indice };
        }
        return { total:[], indice:[] };
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(e.message);
      } finally {
        await queryRunner.release();
      }
  }

}
