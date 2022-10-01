import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;
  
  @Column()
  password!: string;
  
  @Column()
  email?: string;

  @Column()
  emailConfirmedAt?: number;
  
  @Column()
  emailConfirmCode?: string;

  @Column()
  createdAt!: number;
  
  @Column()
  lastLogin!: number;
}
