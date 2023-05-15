import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bot{
    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:40})
    NombreBot:string;

    @Column({type:'varchar', length:350})
    DescripcionBot:string;
}