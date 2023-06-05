import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;
}
