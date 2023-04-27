import { Pago } from "src/pago/entities/pago.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class CategoriaPago {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:40})
    TipoCategoriaPago:string;

    @Column({type:'varchar', length:40})
    CodeCategoriaPago:string;

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @OneToMany(() => Pago, (pago:Pago) => pago.categoriaPago)
    pagos:Pago[];
    
}