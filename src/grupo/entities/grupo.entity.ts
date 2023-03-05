import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Grupo {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar', length:20})
    NombreGrupo:string;

    @Column({nullable:true, type:'varchar', length:100})
    DescGrupo:string;

}
