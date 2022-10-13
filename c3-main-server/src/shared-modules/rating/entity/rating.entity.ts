import { AccountEntity } from "shared-modules/account/entity/account.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity('rating')
export class RatingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  gameModeSeasonId!: number;

  @ManyToOne(() => AccountEntity, a => a.id)
  @JoinColumn({ name: 'account_id' })
  account!: AccountEntity;

  // @RelationId((r: RatingEntity) => r.account)
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
