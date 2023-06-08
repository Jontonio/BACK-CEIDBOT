import { Matricula } from "src/matricula/entities/matricula.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Institucion {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:60})
    NombreInstitucion:string;

    @Column({nullable:true,type:'varchar', length:60})
    EscuelaProfe:string;

    @Column({type:'boolean', default:true })
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
    
    /** Tablas relacionadas */
    @OneToMany(() => Matricula, (matricula:Matricula) => matricula.institucion)
    matriculas:Matricula[];
}
