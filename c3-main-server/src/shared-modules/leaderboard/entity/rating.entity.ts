import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('rating')
export class RatingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  gameModeSeasonId!: number;

  @Column()
  accountId!: number;

  @Column({ type: 'double precision' })
  rating!: number;
  
  @Column({ type: 'double precision' })
  rd!: number;
  
  @Column({ type: 'double precision' })
  vol!: number;
  
  @Column({ type: 'double precision' })
  score!: number;

  @Column()
  matches!: number;

  // csv of up to 10 of the latest matches timestamps for score calculation
  @Column()
  lastMatchTimestamps!: string;
}
