import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Grupo } from "./grupo.entity";

@Entity()
export class TipoGrupo {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar', length:20})
    NombreGrupo:string;

    @Column({nullable:true, type:'varchar', length:100})
    DescGrupo:string;

    @Column({default:true})
    Estado:boolean;

    @OneToMany(() => Grupo, (grupo:Grupo) => grupo.Id)
    grupos: Grupo[];

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}
