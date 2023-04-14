import { Curso } from "src/curso/entities/curso.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Nivel {
    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar', length:15})
    Nivel:string;

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @CreateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @OneToMany(() => Curso, (cursos:Curso) => cursos.nivel)
    cursos: Curso[];
}
