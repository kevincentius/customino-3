import { AccountEntity } from "shared-modules/account/entity/account.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity('rating')
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  gameModeSeasonId!: number;

  @ManyToOne(() => AccountEntity, a => a.id)
  account!: AccountEntity;

  @RelationId((r: Rating) => r.account)
  accountId!: number;

  @Column({ type: 'double precision' })
  rating!: number;
  
  @Column({ type: 'double precision' })
  rd!: number;
  
  @Column({ type: 'double precision' })
  vol!: number;
  
  @Column()
  matches!: number;

  // csv of up to 10 of the latest matches timestamps for score calculation
  @Column()
  lastMatchTimestamps!: string;
}
