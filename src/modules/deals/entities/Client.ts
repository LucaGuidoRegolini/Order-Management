import { User } from '@modules/users/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Deal } from './Deal';
import { Email } from './Email';

@Entity('clients')
export class Client {
  [key: string]: unknown;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client_pipedrive_id: number;

  @Column()
  name: string;

  @OneToMany(() => Deal, deal => deal.client, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  deals: Deal[];

  @OneToMany(() => Email, email => email.client, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  email: Email[];

  @Column()
  user_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
