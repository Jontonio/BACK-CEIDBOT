import { Curso } from "src/curso/entities/curso.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Libro {
    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:100})
    TituloLibro:string;

    @Column({type:'varchar', length:350})
    DescripcionLibro:string;

    @Column({type:'float'})
    CostoLibro:number;

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
    
    /** Tablas relacionadas */
    @ManyToOne( () => Curso, (curso:Curso) => curso.libros )
    curso: Curso;
}