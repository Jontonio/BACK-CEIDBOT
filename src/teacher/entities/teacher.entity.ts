import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Teacher {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar', length:5})
    TipoDocumento:string;
    
    @Column({type:'varchar', length:11})
    @Index({unique:true})
    Documento:number;

    @Column({type:'varchar', length:45})
    Nombres:string;

    @Column({type:'varchar', length:45})
    ApellidoPaterno:string;

    @Column({type:'varchar', length:45})
    ApellidoMaterno:string;

    @Column({type:'varchar', length:100})
    Direccion:string;

    @Column({type:'varchar', length:45})
    @Index({unique:true})
    Email:string;

    @Column({type:'varchar', length:15})
    Celular:number;

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}
