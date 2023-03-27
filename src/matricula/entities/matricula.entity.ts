import { Curso } from "src/curso/entities/curso.entity";
import { DenominacionServicio } from "src/denominacion-servicio/entities/denominacion-servicio.entity";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Institucion } from "src/institucion/entities/institucion.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Matricula {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:350, default:null})
    MotivoBaja:string;

    @Column({type:'varchar', length:15, default:'prematricula'})
    EstadoMatricula:string;

    @Column({type:'boolean'})
    DeclaraJurada:boolean;

    @Column({type:'boolean'})
    RequiTecnologico:boolean;

    @Column({type:'boolean'})
    CarCompromiso:boolean;

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @ManyToOne( () => Estudiante, (estudiante:Estudiante) => estudiante.matriculas )
    estudiante:Estudiante;
    
    @ManyToOne( () => DenominacionServicio, (denominServivio:DenominacionServicio) => denominServivio )
    denomiServicio:DenominacionServicio;

    @ManyToOne( () => Curso, (curso:Curso) => curso.matriculas )
    curso:Curso;

    @ManyToOne( () => Institucion, (institucion:Institucion) => institucion.matriculas )
    institucion:Institucion;

    @OneToMany(() => EstudianteEnGrupo, (EstuEnGrupo:EstudianteEnGrupo) => EstuEnGrupo.matricula, {
        cascade:true
    })
    estudianteEnGrupo:EstudianteEnGrupo[];
}

