import { Grupo } from "src/grupo/entities/grupo.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Nivel } from "src/nivel/entities/nivel.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class Curso {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:40})
    NombrePais:string;

    @Column({type:'int'})
    NumModulos:number;

    @Column({type:'varchar', length:350})
    DescripcionCurso:string;
    
    @Column({type:'varchar', length:45})
    NombreCurso:string;

    @Column({type:'varchar', length:50})
    UrlBandera:string;

    @Column({type:'varchar'})
    LinkRequistos:string;

    @Column({default:true})
    Estado:boolean;

    @Column({default:false})
    EstadoApertura:boolean;
    
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** Tablas relacionadas */
    @OneToMany(() => Grupo, (grupo:Grupo) => grupo.Id)
    grupos: Grupo[];

    @OneToMany(() => Matricula, (matricula:Matricula) => matricula.curso)
    matriculas:Matricula[];

    @ManyToOne(() => Nivel, (niveles:Nivel) => niveles.cursos)
    nivel: Nivel;
}
