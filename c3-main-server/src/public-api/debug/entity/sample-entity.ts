import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SampleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;
  
  @Column()
  likesToPlay!: boolean;
}
