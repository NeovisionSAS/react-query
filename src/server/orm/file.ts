import { Column, Entity } from "typeorm";
import { PrimaryEntity } from "./entity";

@Entity()
export class File extends PrimaryEntity {
    @Column({ nullable: false, unique: true })
    name!: string;

    @Column({ nullable: false, type: "blob" })
    file!: string
}