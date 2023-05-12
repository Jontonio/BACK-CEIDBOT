import { CategoriaPago } from "src/categoria-pago/entities/categoria-pago.entity";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { GrupoModulo } from "src/grupo/entities/grupoModulo.entity";
import { MedioDePago } from "src/medio-de-pago/entities/medio-de-pago.entity";
import { Tramite } from "src/tramite/entities/tramite.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Pago {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar'})
    VoucherUrl:string;

    @Column({nullable:true, type:'date'})
    FechaPago:Date;

    @Column({nullable:true, type:'varchar'})
    CodigoVoucher:string;

    @Column({type:'float'})
    MontoPago:number;
    
    @Column({type:'boolean', default:false})
    Verificado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @ManyToOne( () => EstudianteEnGrupo, (estudianteEnGrupo:EstudianteEnGrupo) => estudianteEnGrupo.pagos )
    estudianteEnGrupo:EstudianteEnGrupo;

    @ManyToOne( () => CategoriaPago, (categoriaPago:CategoriaPago) => categoriaPago.pagos )
    categoriaPago:CategoriaPago;

    @ManyToOne( () => MedioDePago, (medioDePago:MedioDePago) => medioDePago.pagos )
    medioDePago:MedioDePago;

    @OneToMany(() => Tramite, (tramite:Tramite) => tramite.pago)
    tramites: Tramite[];

    @ManyToOne( () => GrupoModulo, (grupoModulo:GrupoModulo) => grupoModulo.pagos )
    grupoModulo:GrupoModulo;
}
