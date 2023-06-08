import { UserRole } from 'src/shared/enums';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
