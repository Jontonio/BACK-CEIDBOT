import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { DataSource, Repository } from 'typeorm';
import { FirstPagoDto } from './dto/first-pago.dto';
import { HandlePago } from 'src/class/global-handles';
import { Mora } from './entities/mora.entity';

@Injectable()
export class PagoService {

  constructor(private dataSource: DataSource,
              @InjectRepository(Pago) 
               private pagoModel:Repository<Pago>,
               @InjectRepository(Mora) 
               private moraModel:Repository<Mora>){}

  async create(createPagoDto: CreatePagoDto) {
    try {
      const mensualidad =  await this.pagoModel.save(createPagoDto);
      return new HandlePago(`Se ha registrado su pago correctamente 🎉`, true, mensualidad);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR AL REGISTRAR DATOS DE PAGO');
    }
  }

  async autoRegistrerMensualidad(firstPagoDto: FirstPagoDto[]){
    try {
      return await this.pagoModel.save(firstPagoDto);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REGISTER_AUTO_MENSUALIDAD');
    }
  }

  async update(Id: number, updatePagoDto: UpdatePagoDto) {
    try {
      const { affected } = await this.pagoModel.update(Id, updatePagoDto);
      if(affected==0) return new HandlePago(`Ningún pago sin actu`, false, null);
      return new HandlePago(`Los datos del pago realizado fueron actualizados correctamente`, true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_UPDATE_MENSUALIDAD');
    }
  }

  async remove(Id: number) {
    try {
      const existPago = await this.pagoModel.findOneBy({Id});
      if(!existPago){
      return new HandlePago(`El pago con Id ${Id} no se ha encontrado`, true, null);
      }
      const { affected } = await this.pagoModel.update(Id,{ Estado: false });
      if(affected==0) return new HandlePago(`Ningún pago afectado`, false, null);
      return new HandlePago(`El pago con Id ${Id} fue eliminado correctamente`, true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR DELETE MENSUALIDAD');
    }
  }
  
  async generarMoras(): Promise<void> {
    try {
      const res = await this.dataSource.query(`
      INSERT INTO mora (estudianteEnGrupoId, grupoModuloId, MontoMora, Verificado, EstadoMora)
      SELECT estudiante_en_grupo.Id, grupo_modulo.Id, 5, false, true
      FROM estudiante
      INNER JOIN estudiante_en_grupo ON estudiante.Id = estudiante_en_grupo.estudianteId
      INNER JOIN grupo ON estudiante_en_grupo.grupoId = grupo.Id
      INNER JOIN grupo_modulo ON grupo.Id = grupo_modulo.grupoId
      WHERE grupo_modulo.CurrentModulo = true and
          grupo.Estado != false AND
            grupo.estadoGrupoId != 3 AND 
            estudiante_en_grupo.Estado != false AND 
            DATEDIFF(CURDATE(), grupo_modulo.FechaPago) > 5 AND
            NOT EXISTS (
              SELECT * FROM mora
              WHERE mora.grupoModuloId = grupo_modulo.Id AND mora.estudianteEnGrupoId = estudiante_en_grupo.Id
            ) AND
            NOT EXISTS (
              SELECT * FROM pago
              WHERE pago.grupoModuloId = grupo_modulo.Id AND pago.Verificado IS NOT NULL AND pago.CodigoVoucher IS NOT NULL AND pago.CodigoVoucher <> '' AND (pago.Estado IS NULL OR pago.Estado != 0) AND
              pago.estudianteEnGrupoId = estudiante_en_grupo.Id AND pago.grupoModuloId = grupo_modulo.Id
            );
      `);
      return res;
    } catch (e) {
      throw new InternalServerErrorException('ERROR AL CREAR MORAS');
    }
  }

  async listaEstudiantesSinPagar(){
    return `
    SELECT * FROM estudiante
    INNER JOIN estudiante_en_grupo ON estudiante.Id = estudiante_en_grupo.estudianteId
    INNER JOIN grupo ON estudiante_en_grupo.grupoId = grupo.Id
    INNER JOIN grupo_modulo ON grupo.Id = grupo_modulo.grupoId
    WHERE grupo.Estado != false AND
          grupo.estadoGrupoId != 3 AND 
          estudiante_en_grupo.Estado != false  AND 
          grupo_modulo.FechaPago >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND
          grupo_modulo.FechaPago <= DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    AND NOT EXISTS (
      SELECT * FROM pago
      WHERE pago.grupoModuloId = grupo_modulo.Id AND pago.Verificado IS NOT NULL AND pago.CodigoVoucher IS NOT NULL AND pago.CodigoVoucher <> '' AND (pago.Estado IS NULL OR pago.Estado != 0)
      AND pago.estudianteEnGrupoId = estudiante_en_grupo.Id AND pago.grupoModuloId = grupo_modulo.Id
    );
    `;
  }

}
