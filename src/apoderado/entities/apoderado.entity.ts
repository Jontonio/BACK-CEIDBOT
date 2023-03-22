import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Apoderado {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:8})
    @Index({unique:true})
    DNIApoderado:string;

    @Column({type:'varchar', length:45})
    NomApoderado:string;

    @Column({type:'varchar', length:45})
    ApellidoPApoderado:string;

    @Column({type:'varchar', length:45})
    ApellidoMApoderado:string;

    @Column({type:'varchar', length:9})
    CelApoderado:string;

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

