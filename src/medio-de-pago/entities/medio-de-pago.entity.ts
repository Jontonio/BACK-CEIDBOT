
import { Pago } from "src/pago/entities/pago.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MedioDePago {
    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:45})
    MedioDePago:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas  */
    @OneToMany(() => Pago, (pago:Pago) => pago.medioDePago)
    pagos:Pago[];
}