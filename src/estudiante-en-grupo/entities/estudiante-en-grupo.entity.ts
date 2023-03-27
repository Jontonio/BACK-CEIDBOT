import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Grupo } from "src/grupo/entities/grupo.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class EstudianteEnGrupo {
    
    @PrimaryGeneratedColumn('increment')
    Id:number;

    @ManyToOne( () => Estudiante, (estudiante:Estudiante) => estudiante.estudianteEnGrupo )
    estudiante:Estudiante;

    @ManyToOne( () => Grupo, (grupo:Grupo) => grupo )
    grupo:Grupo;

    grupoId:number;
    
    @Column({default:true})
    Estado:boolean;
    
    @ManyToOne( () => Matricula, (matricula:Matricula) => matricula )
    matricula:Matricula;

    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updateddAt:Date;
}
