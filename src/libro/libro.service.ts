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

 /**
  * This function creates a new book record and returns a success message with the book details, or
  * throws an error if there is an issue with the registration process.
  * @param {CreateLibroDto} createLibroDto - `createLibroDto` is a parameter of type `CreateLibroDto`,
  * which is likely an interface or a class defining the properties and their types for creating a new
  * "Libro" (book) object. This parameter is used to save the new "Libro" object to the database
  * @returns A `HandleLibro` object is being returned, which contains a message, a boolean value
  * indicating success or failure, and the newly created `libro` object.
  */
  async create(createLibroDto: CreateLibroDto) {
    try {
      const libro = await this.libroModel.save(createLibroDto);
      return new HandleLibro('Libro registrado correctamente', true, libro);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR REGISTRAR LIBRO');
    }
  }
  
 /**
  * This function finds a book by its ID and returns a HandleLibro object with information about the
  * book.
  * @param {number} Id - The parameter "Id" is a number that represents the unique identifier of a book
  * that is being searched for in a database.
  * @returns an instance of the `HandleLibro` class with a message indicating whether the book with the
  * given `Id` was found or not, and the book object itself if it was found. If the book is not found,
  * a `NotFoundException` is thrown with a message indicating that the book with the given `Id` does
  * not exist. If any other error occurs during the execution
  */
  async findOne(Id: number) {
    try {
      const libro = await this.libroModel.findOneBy({Id, Estado:true});
      if(!libro){
        throw new NotFoundException(`El libro con Id ${Id} no existe`);
      }
      return new HandleLibro(`Libro con Id ${Id} encontrado`, true, libro);
    } catch (e) {
      console.log(e.message)
      throw new InternalServerErrorException('ERROR OBTENER LIBRO');
    }
  }

  /**
   * This is an async function that updates a book in a database and returns a message indicating
   * whether the update was successful or not.
   * @param {number} Id - The ID of the libro (book) that needs to be updated.
   * @param {UpdateLibroDto} updateLibroDto - UpdateLibroDto is a data transfer object that contains
   * the updated information for a book. It is used to update the book record in the database.
   * @returns an instance of the `HandleLibro` class with a message indicating whether the libro was
   * updated successfully or not, a boolean value indicating the success status, and the updated libro
   * object if the update was successful. If an error occurs, the function throws an
   * `InternalServerErrorException`.
   */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ACTUALIZAR LIBRO');
    }
  }

  /**
   * This is an async function that removes a book from a database by setting its Estado property to
   * false, and returns a HandleLibro object with a success message if the book was successfully
   * removed.
   * @param {number} Id - The parameter `Id` is a number representing the unique identifier of a book
   * that needs to be removed from the database.
   * @returns The `remove` function returns an instance of the `HandleLibro` class with a message
   * indicating whether the book was successfully deleted or not. If the book was not found, a
   * `NotFoundException` is thrown. If there is an error during the deletion process, an
   * `InternalServerErrorException` is thrown.
   */
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
      console.log(e.message)
      throw new InternalServerErrorException('ERROR ELIMINAR LIBRO');
    }
  }
}
