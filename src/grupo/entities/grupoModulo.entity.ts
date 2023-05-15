import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Grupo } from "./grupo.entity";
import { Modulo } from "src/curso/entities/modulo.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { Mora } from "src/pago/entities/mora.entity";

@Entity()
export class GrupoModulo {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'date'})
    FechaPago:Date;

    @Column({type:'boolean', default:false})
    CurrentModulo:boolean;
    
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @ManyToOne( () => Grupo, (grupo:Grupo) => grupo.grupoModulo )
    grupo:Grupo;

    @ManyToOne( () => Modulo, (modulo:Modulo) => modulo.grupoModulo )
    modulo:Modulo;

    @OneToMany(() => Pago, (pago:Pago) => pago.grupoModulo )
    pagos:Pago[];

    @OneToMany(() => Mora, (mora:Mora) => mora)
    moras: Mora[];
}
