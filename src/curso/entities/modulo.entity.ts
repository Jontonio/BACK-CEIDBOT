import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Curso } from "./curso.entity";
import { GrupoModulo } from "src/grupo/entities/grupoModulo.entity";

@Entity()
export class Modulo{
    
    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'int'})
    Modulo:number;

    @Column({type:'boolean', default:true})
    Estado:boolean;
    
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @OneToMany(() => Curso, (curso:Curso) => curso.modulo)
    cursos: Curso[];

    @OneToMany(() => GrupoModulo, (grupoModulo:GrupoModulo) => grupoModulo.modulo, {
        cascade:true
    })
    grupoModulo:GrupoModulo[];
}