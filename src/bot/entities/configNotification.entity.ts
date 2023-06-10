import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ConfigNotification {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'integer'})
    HoraNotificacion:number;

    @Column({type:'integer'})
    MinutoNotificacion:number;

    @Column({type:'varchar', length:100})
    DescriptionNotificacion:string;

    @UpdateDateColumn()
    updatedAt:Date;
}