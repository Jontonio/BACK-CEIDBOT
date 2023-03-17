import { Estudiante } from "src/estudiante/entities/estudiante.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Departamento {
    
    @PrimaryGeneratedColumn({type:'int'})
    IdDepartamento:number;        
	
    @Column({type:'varchar', length:30})
    NombreDepartamento:string;      
	
    @Column({type:'varchar', length:45})
    EtiquetaUbigeo:string;       
	
    @Column({type:'int'})
    CodigoUbigeo:number;
	
    @Column({type:'varchar', length:44})
    BuscadorUbigeo:string;      
	
    @Column({type:'int'})
    NumeroHijosUbigeo:number;
	
    @Column({type:'int'})
    NivelUbigeo:number;
	
    @Column({type:'int'})
    IdPadreUbigeo:number;    
    
    /** tablas relacionadas  */
    @OneToMany(() => Estudiante, (estudiante:Estudiante) => estudiante.departamento, {
        cascade:true
    })
    estudiantes: Estudiante[];
}
