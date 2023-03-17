import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Apoderado {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:8})
    @Index({unique:true})
    DNI:string;

    @Column({type:'varchar', length:45})
    Nombres:string;

    @Column({type:'varchar', length:45})
    ApellidoPaterno:string;

    @Column({type:'varchar', length:45})
    ApellidoMaterno:string;

    @Column({type:'varchar', length:9})
    Celular:string;

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

     /** tablas relacionadas  */
     @OneToMany(() => Estudiante, (estudiante:Estudiante) => estudiante.apoderado, {
        cascade:true
     })
     estudiantes: Estudiante[];
}

