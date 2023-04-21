import { Curso } from "src/curso/entities/curso.entity";
import { Docente } from "src/docente/entities/docente.entity";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { Horario } from "src/horario/entities/horario.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TipoGrupo } from "./tipo-grupo.entity";

@Entity()
export class Grupo {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'datetime'})
    FechaFinalGrupo:Date;

    @Column({type:'datetime'})
    FechaInicioGrupo:Date;
    
    @Column({nullable:true, type:'varchar', length:350})
    DescGrupo:string;
    
    @Column({type:'int'})
    MaximoEstudiantes:number;

    @Column({type:'int', default:0})
    NumeroEstudiantes:number;

    @Column({type:'varchar', length:15})
    Modalidad:string;

    @Column({type:'boolean'})
    RequeridoPPago:boolean;

    @ManyToOne( () => Docente, (docente:Docente) => docente.grupos)
    docente:Docente;

    @ManyToOne( () => TipoGrupo, (TGrupo:TipoGrupo) => TGrupo.grupos)
    tipoGrupo:TipoGrupo;

    @ManyToOne( () => Horario, (horario:Horario) => horario.grupos)
    horario:Horario;

    @ManyToOne( () => Curso, (curso:Curso) => curso.grupos)
    curso:Curso;

    @OneToMany(() => EstudianteEnGrupo, (EstuEnGrupo:EstudianteEnGrupo) => EstuEnGrupo.grupo, {
        cascade:true
    })
    estudianteEnGrupo:EstudianteEnGrupo[];

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}
