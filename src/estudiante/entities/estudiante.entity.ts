import { Apoderado } from "src/apoderado/entities/apoderado.entity";
import { EstudianteEnGrupo } from "src/estudiante-en-grupo/entities/estudiante-en-grupo.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Tramite } from "src/tramite/entities/tramite.entity";
import { Departamento } from "src/ubigeo/entities/departamento.entity";
import { Distrito } from "src/ubigeo/entities/distrito.entity";
import { Provincia } from "src/ubigeo/entities/provincia.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Estudiante {

    @PrimaryGeneratedColumn('increment')
    Id:number;

    @Column({type:'varchar', length:5})
    TipoDocumento:string;
    
    @Column({type:'varchar', length:12})
    @Index({unique:true})
    Documento:string;

    @Column({type:'varchar', length:45})
    Nombres:string;

    @Column({type:'varchar', length:45})
    ApellidoPaterno:string;

    @Column({type:'varchar', length:45})
    ApellidoMaterno:string;

    @Column({type:'varchar', length:10})
    Sexo:string;

    @Column({type:'date'})
    FechaNacimiento:Date;

    @Column({type:'varchar', length:100})
    Direccion:string;

    @Column({type:'varchar', length:9})
    Celular:string;

    @Column({nullable:true, type:'varchar', length:5})
    Code:string;

    @Column({nullable:true, type:'varchar', length:10})
    CodePhone:string;
    
    @Column({type:'varchar', length:50})
    @Index({unique:true})
    Email:string;

    @Column({type:'boolean'})
    EsMayor:boolean;

    @Column({default:true})
    Estado:boolean;

    
    /** tablas relacionadas  */
    @ManyToOne( () => Apoderado, (apoderado:Apoderado) => apoderado.estudiantes )
    apoderado:Apoderado;
    
    apoderadoId:number;
    
    @OneToMany(() => Matricula, (matricula:Matricula) => matricula.estudiante, {
        cascade:true
    })
    matriculas:Matricula[];

    @OneToMany(() => Tramite, (tramite:Tramite) => tramite.estudiante, {
        cascade:true
    })
    tramites:Tramite[];

    @OneToMany(() => EstudianteEnGrupo, (EstuEnGrupo:EstudianteEnGrupo) => EstuEnGrupo.estudiante, {
        cascade:true
    })
    estudianteEnGrupo:EstudianteEnGrupo[];

    @ManyToOne( () => Departamento, (departamento:Departamento) => departamento.estudiantes )
    departamento:Departamento;

    @ManyToOne( () => Provincia, (provincia:Provincia) => provincia.estudiantes )
    provincia:Provincia;

    @ManyToOne( () => Distrito, (distrito:Distrito) => distrito.estudiantes )
    distrito:Distrito;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    @BeforeInsert()
    nameToLowerCase(){
        this.Nombres = this.Nombres.toLowerCase();
        this.ApellidoPaterno = this.ApellidoPaterno.toLowerCase();
        this.ApellidoMaterno = this.ApellidoMaterno.toLowerCase();
        this.Email = this.Email.toLowerCase();
    }

 
}
