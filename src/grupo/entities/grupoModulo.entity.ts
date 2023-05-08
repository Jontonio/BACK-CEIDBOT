import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Grupo } from "./grupo.entity";
import { Modulo } from "src/curso/entities/modulo.entity";

@Entity()
export class GrupoModulo {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'date'})
    FechaPago:Date;

    @Column({type:'boolean', default:false})
    CurrentModulo:boolean;
    
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @ManyToOne( () => Grupo, (grupo:Grupo) => grupo.grupoModulo )
    grupo:Grupo;

    @ManyToOne( () => Modulo, (modulo:Modulo) => modulo.grupoModulo )
    modulo:Modulo;
}
