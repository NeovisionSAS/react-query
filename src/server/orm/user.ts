import { PrimaryEntity } from "./entity";
import { Column, Entity } from "typeorm";

    
@Entity()
export class User extends PrimaryEntity {
    @Column({ nullable: false, unique: true })
    name!: string;

    @Column({ nullable: false })
    age!: number

    @Column({nullable: true})
    nationality?: string;
}