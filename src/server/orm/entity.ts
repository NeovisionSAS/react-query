import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

    
@Entity()
export class PrimaryEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id?: number
}