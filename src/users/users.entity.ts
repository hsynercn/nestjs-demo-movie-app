import { UserRole } from '../shared/enums';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Unique(['email'])
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  password: string;

  @Column()
  role: UserRole;
}
