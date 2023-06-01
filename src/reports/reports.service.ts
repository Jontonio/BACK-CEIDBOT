import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataHorizontalBar } from 'src/class/Graphics';
import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {

  constructor(private dataSource: DataSource){}

/**
 * This function retrieves a list of students with their payment information for a specific group,
 * payment category, and module.
 * @param {number} IdGrupo - The ID of the group for which you want to retrieve the list of students
 * with payments.
 * @param {number} IdCategoriaPago - The Id of the payment category for which you want to retrieve the
 * list of students with payments.
 * @param {number} Modulo - The "Modulo" parameter is a number that represents a module. It is used in
 * the SQL query to filter the results by a specific module.
 * @returns the result of a SQL query that retrieves information about students who have made a payment
 * for a specific group and module, filtered by a specific payment category. The returned data includes
 * the student's name, payment category type, payment amount, payment date, payment verification
 * status, payment method, and module number.
 */
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
        console.log(e.message)
        throw new InternalServerErrorException('ERROR LISTA ESTUDIANTES PAGO GRUPO MODULO');
      } finally {
        await queryRunner.release();
      }
  }

 /**
  * This function retrieves a summary of total payments by category and group for a specific month and
  * year.
  * @param {string} anio - A string representing the year for which the payment summary is to be
  * generated.
  * @param {string} numMes - numMes is a string parameter representing the month number for which the
  * total payments summary is being requested. For example, "01" for January, "02" for February, and so
  * on.
  * @returns the result of a SQL query that retrieves a summary of total payments by category and group
  * for a given year and month. The result includes the group ID, course name, level, total payment
  * amount, month number, and payment category type.
  */
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
        console.log(e.message)
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('ERROR RESUMENTO TOTAL PAGOS');
      } finally {
        await queryRunner.release();
      }
  }

  /**
   * This function generates a report of payments for other types of procedures based on the year and
   * month provided.
   * @param {string} anio - The year for which the payment report is being generated. It is a string
   * type parameter.
   * @param {string} numMes - numMes is a string parameter representing the month number for which the
   * report is being generated. For example, "01" for January, "02" for February, and so on.
   * @returns the result of a SQL query that calculates the total payment amount for each type of
   * tramite (transaction) in a given month and year. The result is grouped by the type of tramite and
   * includes the total payment amount and the month number.
   */
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
        console.log(e.message)
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('ERROR REPORTE PAGOS OTROS TIPOS');
      } finally {
        await queryRunner.release();
      }
  }

 /**
  * This function retrieves the debt index for a specific group and returns the total amount paid,
  * total amount to be paid, percentage of current payment, and percentage of overdue debt.
  * @param {string} grupoId - The `grupoId` parameter is a string representing the ID of a group for
  * which the debt index report is being generated.
  * @returns an object with two properties: "total" and "indice". Both properties are arrays of objects
  * with "name" and "value" properties. The "total" array contains two objects representing the total
  * amount paid and the total amount to be paid for a specific group and module. The "indice" array
  * contains two objects representing the percentage of the current payment and the percentage of the
  */
  async indiceDeudaGruposEnProceso(grupoId:string){
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const res = await queryRunner.query(`
        SELECT grupo_modulo.grupoId, 
               modulo.Modulo as modulo, 
               SUM(CASE WHEN categoria_pago.Id = 1 THEN pago.MontoPago ELSE 0 END) as total_pagado, (SELECT SUM(denominacion_servicio.MontoPension) from denominacion_servicio INNER JOIN matricula ON denominacion_servicio.Id = matricula.denomiServicioId INNER JOIN estudiante_en_grupo on matricula.Id = estudiante_en_grupo.matriculaId WHERE estudiante_en_grupo.grupoId = grupo_modulo.grupoId) As total_a_pagar,
          (SUM(CASE WHEN categoria_pago.Id = 1 THEN pago.MontoPago ELSE 0 END) * 100) / (SELECT SUM(denominacion_servicio.MontoPension) from denominacion_servicio INNER JOIN matricula ON denominacion_servicio.Id = matricula.denomiServicioId INNER JOIN estudiante_en_grupo on matricula.Id = estudiante_en_grupo.matriculaId WHERE estudiante_en_grupo.grupoId = grupo_modulo.grupoId) As indice_del_pago_actual
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
                     {name:`Por pagar módulo ${res[0].modulo}`, value:res[0].total_a_pagar - res[0].total_pagado})
          indice.push({name:`Porcentaje pago módulo ${res[0].modulo}`, value:res[0].indice_del_pago_actual},
                      {name:`Porcentaje deuda vencida módulo ${res[0].modulo}`, value:100-res[0].indice_del_pago_actual})
          return { total, indice };
        }
        return { total:[], indice:[] };
      } catch (e) {
        console.log(e.message)
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('ERROR INDICE DEUDA GRUPOS EN PROCESO');
      } finally {
        await queryRunner.release();
      }
  }

}
