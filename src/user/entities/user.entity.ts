import { Role } from "src/role/entities/role.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('increment')
    Id:number;
    
    @Column({type:'varchar', length:10})
    DNI:string;

    @Column({type:'varchar', length:45})
    Name:string;

    @Column({type:'varchar', length:45})
    FirstName:string;

    @Column({type:'varchar', length:45})
    LastName:string;

    @Column({type:'varchar', length:45})
    @Index({unique:true})
    Email:string;

    @Column({type:'varchar', length:100})
    Password:string;

    @Column({default:false})
    IsActive:boolean;

    @Column({default:true})
    Status:boolean;

    @Column({type:'timestamp',default:null})
    DateAccess:Date;

    @ManyToOne( type => Role, role => role.users )
    role:Role;
    
    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;

}
