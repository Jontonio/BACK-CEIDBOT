import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleEstudiante } from 'src/class/global-handles';
import { Repository } from 'typeorm';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { EmailDocEstudianteDto } from './dto/emailDocestudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { Estudiante } from './entities/estudiante.entity';
import { RequestEstudianteDto } from './dto/request-estudiante.dto';

@Injectable()
export class EstudianteService {

  constructor(@InjectRepository(Estudiante) 
              private estudianteModel:Repository<Estudiante>){}

  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      const estudiante = await this.estudianteModel.save(createEstudianteDto);
      return new HandleEstudiante(`Estudiante ${estudiante.Nombres} registrado correctamente`, true, estudiante);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_ESTUDIANTE');
    }
  }

  async verifyEmailDocumento(emailDocEstudianteDto:EmailDocEstudianteDto){
    try {
      const estudiante = await this.estudianteModel.findOne({
        where:{ Email:emailDocEstudianteDto.Email }
      });

      if(estudiante){
        if(estudiante.Documento!=emailDocEstudianteDto.Documento){
          return new HandleEstudiante(`El email ${estudiante.Email} del estudiante ya se encuentra registrado`, false, null);
        }
      }
      return new HandleEstudiante(`El email del estudiante es válido`, true, null);

    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_VERIFY_EMAIL_DOCUMENTO_ESTUDIANTE');
    }
  }

  async saveEstudiante(createEstudianteDto: CreateEstudianteDto) {
    try {
      return await this.estudianteModel.save(createEstudianteDto);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_CREATE_ESTUDIANTE');
    }
  }

  async findAllHermanos(IdApoderado:number) {
    try {
      return await this.estudianteModel.find({ where:{ apoderado:{ Id:IdApoderado } } });
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_FIND_HERMANOS');
    }
  }

  async findOne(Id: number) {
    try {
      return await this.estudianteModel.findOneBy({Id});
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTE');
    }
  }

  async findOneByDocumento(requestEstudianteDto:RequestEstudianteDto) {
    try {
      const { Documento, TipoDocumento } = requestEstudianteDto;
      const query = TipoDocumento?{ Documento, TipoDocumento }:{ Documento };
      const estudiante = await this.estudianteModel.findOne({
        where: query,
        relations:['departamento','provincia','distrito','apoderado']
      });
      if(!estudiante){
        return new HandleEstudiante(`Estudiante con ${Documento} no encontrado`, false, null);
      }
      return new HandleEstudiante(`Se encontraron registros de ${estudiante.Nombres}, actualice los datos si fuese necesario para continuar`, true, estudiante);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTE');
    }
  }

  async findOneByDocumentoInternal(Documento: string, TipoDocumento = '') {
    try {
      const where = TipoDocumento?{ Documento, TipoDocumento }:{ Documento };
      return await this.estudianteModel.findOne({
        where,
        relations:['departamento','provincia','distrito','apoderado']
      });
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTE');
    }
  }

  async findOneByEmail(Email: string) {
    try {
      return await this.estudianteModel.findOne({
        where:{ Email },
        relations:['departamento','provincia','distrito','apoderado']
      });
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_GET_ESTUDIANTE');
    }
  }

  update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    return `This action updates a #${id} estudiante`;
  }
  
  async updateByDocumento(Documento: string, updateEstudianteDto: UpdateEstudianteDto) {
    try {
      const { affected } = await this.estudianteModel.update({Documento}, updateEstudianteDto);
      if(affected==0) return new HandleEstudiante('Grupo sin afectar ', false, null)
      const estudiante = await this.estudianteModel.findOneBy({Documento});
      return new HandleEstudiante(`Estudiante ${estudiante.Nombres} actualizado correctamente`, true, estudiante);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('ERROR_UPDATE_ESTUDIANTE');
    }
  }

  async remove(Id: number) {
    try {
      const estudiante = await this.estudianteModel.findOne({where:{Id}});
      if(!estudiante){
        throw new NotFoundException(`No se encontro al estudiante con el Id ${Id}`);
      }
      return await this.estudianteModel.delete({Id});
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_REMOVE_ESTUDIANTE');
    }
  }
}
