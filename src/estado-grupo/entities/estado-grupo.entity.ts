import { Grupo } from "src/grupo/entities/grupo.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class EstadoGrupo {
    
    @PrimaryGeneratedColumn('increment')
    Id:number; 

    @Column({type:'varchar', length:40})
    CodeEstado:string;
    
    @Column({type:'varchar', length:40})
    EstadoGrupo:string;

    @Column({type:'varchar', length:350})
    DescripcionEstadoGrupo:string;

    @Column({default:true})
    Estado:boolean;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @OneToMany(() => Grupo, (grupo:Grupo) => grupo.estadoGrupo)
    grupos: Grupo[];

    /** transform to lowercase */
    @BeforeInsert()
    nameToLowerCase() {
        this.CodeEstado  = this.CodeEstado.toLowerCase();
        this.EstadoGrupo = this.EstadoGrupo.toLowerCase();
    }
}