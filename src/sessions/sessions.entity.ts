import { TimeSlot } from 'src/shared/enums';
import { Entity, Column, PrimaryGeneratedColumn, Index, Unique } from 'typeorm';

@Entity()
@Unique(['roomId', 'timeSlot'])
export class SessionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  movieId: number;

  @Index()
  @Column()
  roomId: number;

  @Column()
  date: Date;

  @Index()
  @Column()
  timeSlot: TimeSlot;
}
