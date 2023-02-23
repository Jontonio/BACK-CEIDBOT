import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Course {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:40})
    NombrePais:string;

    @Column({type:'varchar', length:20})
    NivelCurso:string;

    @Column({type:'varchar', length:355})
    DescripcionCurso:string;


    @Column({type:'varchar', length:45})
    NombreCurso:string;

    @Column({type:'varchar', length:50})
    UrlBandera:string;

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
    
}
