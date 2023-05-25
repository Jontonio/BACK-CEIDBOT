import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { GrupoModulo } from "src/grupo/entities/grupoModulo.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Mora {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'boolean', default:true})
    EstadoMora:boolean;

    @Column({type:'boolean', default:false})
    Verificado:boolean;

    @Column({type:'float'})
    MontoMora:number;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @ManyToOne( () => EstudianteEnGrupo, (estudianteEnGrupo:EstudianteEnGrupo) => estudianteEnGrupo.moras )
    estudianteEnGrupo:EstudianteEnGrupo;

    @ManyToOne( () => GrupoModulo, (grupoModulo:GrupoModulo) => grupoModulo.moras )
    grupoModulo:GrupoModulo;

}
