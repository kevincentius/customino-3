import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SampleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;
  
  @Column()
  likesToPlay!: boolean;
}
