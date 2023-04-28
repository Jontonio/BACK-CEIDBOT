import { Rol } from "src/rol/entities/rol.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar', length:10})
    DNI:string;

    @Column({type:'varchar', length:45})
    Nombres:string;

    @Column({type:'varchar', length:45})
    ApellidoPaterno:string;

    @Column({type:'varchar', length:45})
    ApellidoMaterno:string;

    @Column({type:'varchar', length:15})
    // @Index({unique:true})
    Celular:string;

    @Column({type:'varchar', length:45})
    @Index({unique:true})
    Email:string;

    @Column({type:'varchar', length:100})
    Direccion:string;

    @Column({type:'varchar', length:100})
    Password:string;

    @Column({default:false})
    IsActivo:boolean;

    @Column({default:true})
    Estado:boolean;

    @Column({default:true})
    Habilitado:boolean;

    @Column({type:'timestamp', default:null})
    FechaAcceso:Date;

    @Column({nullable:true, type:'varchar', length:5})
    Code:string;

    @Column({nullable:true, type:'varchar', length:10})
    CodePhone:string;

    @Column({nullable:true, type:'varchar', length:40})
    ResetPasswordToken:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

    /** tablas relacionadas  */
    
    @ManyToOne( () => Rol, (rol:Rol) => rol.usuarios )
    rol:Rol;

    @Column()
    rolId: number;
    

}
