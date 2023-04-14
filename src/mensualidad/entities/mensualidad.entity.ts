import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";

@Entity()
export class Mensualidad {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar'})
    VoucherUrl:string;

    @Column({type:'date'})
    FechaPago:Date;

    @Column({type:'varchar'})
    CodigoVocuher:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @ManyToOne( () => EstudianteEnGrupo, (estudianteEnGrupo:EstudianteEnGrupo) => estudianteEnGrupo.mensualidades )
    estudianteEnGrupo:EstudianteEnGrupo;
}
