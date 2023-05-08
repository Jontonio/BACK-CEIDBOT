import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Pago } from "src/pago/entities/pago.entity";
import { TipoTramite } from "src/tipo-tramite/entities/tipo-tramite.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tramite {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar'})
    UrlRequisito:string;

    @Column({nullable:true, type:'varchar'})
    UrlRequisitoExtra:string;

    @Column({type:'boolean', default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @ManyToOne( () => Estudiante, (estudiante:Estudiante) => estudiante.tramites )
    estudiante:Estudiante;

    @ManyToOne( () => TipoTramite, (tipoTramite:TipoTramite) => tipoTramite.tramites )
    tipoTramite:TipoTramite;

    @ManyToOne( () => Pago, (pago:Pago) => pago.tramites )
    pago:Pago;
}
