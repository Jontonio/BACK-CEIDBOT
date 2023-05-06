import { Tramite } from "src/tramite/entities/tramite.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class TipoTramite {
    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'float'})
    DerechoPagoTramite:number;

    @Column({type:'varchar', length:200})
    TipoTramite:string;

    @Column({type:'varchar', length:350})
    DescripcionTramite:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @OneToMany(() => Tramite, (tramite:Tramite) => tramite.tipoTramite)
    tramites: Tramite[];
}