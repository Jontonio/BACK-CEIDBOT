import { Pago } from "src/pago/entities/pago.entity";
import { TipoTramite } from "src/tipo-tramite/entities/tipo-tramite.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tramite {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar'})
    UrlRequisito:string;

    @Column({type:'varchar'})
    UrlRequisitoExtra:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @ManyToOne( () => TipoTramite, (tipoTramite:TipoTramite) => tipoTramite.tramites )
    tipoTramite:TipoTramite;

    @ManyToOne( () => Pago, (pago:Pago) => pago.tramites )
    pago:Pago;
}
