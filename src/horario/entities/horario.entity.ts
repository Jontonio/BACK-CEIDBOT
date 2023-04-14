import { Grupo } from "src/grupo/entities/grupo.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Horario {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'datetime'})
    HoraInicio:Date;

    @Column({type:'datetime'})
    HoraFinal:Date;
    
    @Column({nullable:true, type:'varchar', length:350})
    DescHorario:string;

    @Column({default:true})
    Estado:boolean;
    
    /** Tablas relacionadas */
    
    @OneToMany(() => Grupo, (grupo:Grupo) => grupo.Id)
    grupos: Grupo[];

    @OneToMany(() => Matricula, (matricula:Matricula) => matricula.curso)
    matriculas:Matricula[];
}
