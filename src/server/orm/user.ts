import { Column, Entity } from 'typeorm';
import { PrimaryEntity } from './entity';

@Entity()
export class User extends PrimaryEntity {
  @Column({ nullable: false, unique: true })
  name!: string;

  @Column({ nullable: false })
  age!: number;

  @Column({ nullable: true })
  nationality?: string;

  @Column({ nullable: true })
  book?: string;

  @Column({ nullable: true })
  dateOfBirth?: string;
}
