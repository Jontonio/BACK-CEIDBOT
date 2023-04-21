import { CategoriaPago } from "src/categoria-pago/entities/categoria-pago.entity";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";

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
}
