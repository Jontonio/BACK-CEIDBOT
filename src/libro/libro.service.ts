import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';
import { Repository } from 'typeorm';
import { HandleLibro } from 'src/class/global-handles';

@Injectable()
export class LibroService {

    constructor(@InjectRepository(Libro) 
    private libroModel:Repository<Libro>){}

  async create(createLibroDto: CreateLibroDto) {
    try {
      const libro = await this.libroModel.save(createLibroDto);
      return new HandleLibro('Libro registrado correctamente', true, libro);
    } catch (e) {
      throw new InternalServerErrorException('ERROR_CREATE_LIBRO');
    }
  }

  findAll() {
    return `This action returns all libro`;
  }

  async findOne(Id: number) {
    try {
      const libro = await this.libroModel.findOneBy({Id, Estado:true});
      if(!libro){
        throw new NotFoundException(`El libro con Id ${Id} no existe`);
      }
      return new HandleLibro(`Libro con Id ${Id} encontrado`, true, libro);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_GET_ONE_LIBRO');
    }
  }

  async update(Id: number, updateLibroDto: UpdateLibroDto) {
    try {
      const libro = await this.libroModel.findOneBy({Id, Estado:true});
      if(!libro){
        throw new NotFoundException(`El libro con Id ${Id} no existe`);
      }
      const { affected } = await this.libroModel.update(Id, updateLibroDto);
      if(affected==0) return new HandleLibro('Libro sin afectar ', false, null)
      const libroUpdated = await this.libroModel.findOneBy({Id, Estado:true});
      return new HandleLibro(`Libro actualizado correctamente`, true, libroUpdated);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_UPDATE_ONE_LIBRO');
    }
  }

  async remove(Id: number) {
    try {
      const libro = await this.libroModel.findOneBy({Id, Estado:true});
      if(!libro){
        throw new NotFoundException(`El libro con Id ${Id} no existe`);
      }
      const { affected } = await this.libroModel.update(Id, { Estado:false });
      if(affected==0) return new HandleLibro('Libro sin afectar ', false, null);
      return new HandleLibro(`Libro eliminado correctamente`, true, null);
    } catch (e) {
      console.log(e)
      throw new InternalServerErrorException('ERROR_DELETE_ONE_LIBRO');
    }
  }
}
