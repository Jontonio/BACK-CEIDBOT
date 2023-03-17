import { Matricula } from "src/matricula/entities/matricula.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class DenominacionServicio{
    
    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:350})
    Descripcion:string;
    
    @Column({type:'float'})
    MontoPension:number;

    @Column({type:'float'})
    MontoMatricula:number;

    @Column({default:true})
    Estado:boolean;
    
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @OneToMany(() => Matricula, (matricula:Matricula) => matricula.denomiServicio)
    matriculas:Matricula[];
}