import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Grupo } from "src/grupo/entities/grupo.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Mora } from "src/pago/entities/mora.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class EstudianteEnGrupo {
    
    @PrimaryGeneratedColumn('increment')
    Id:number;

    
    @Column({default:true})
    Estado:boolean;
    
    
    @CreateDateColumn()
    createdAt:Date;
    
    @UpdateDateColumn()
    updateddAt:Date;
    
    /** Tablas relacionadas */
    @ManyToOne( () => Estudiante, (estudiante:Estudiante) => estudiante.estudianteEnGrupo )
    estudiante:Estudiante;
    
    @ManyToOne( () => Grupo, (grupo:Grupo) => grupo )
    grupo:Grupo;

    @ManyToOne( () => Matricula, (matricula:Matricula) => matricula )
    matricula:Matricula;

    @OneToMany(() => Pago, (pago:Pago) => pago.estudianteEnGrupo, {
        cascade:true
    })
    pagos:Pago[];

    @OneToMany(() => Mora, (mora:Mora) => mora.estudianteEnGrupo)
    moras: Mora[];
}
