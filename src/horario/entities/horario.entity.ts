import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Horario {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'datetime'})
    HoraInicio:Date;

    @Column({type:'datetime'})
    HoraFinal:Date;
    
    @Column({nullable:true, type:'varchar', length:100})
    DescHorario:string;
}
