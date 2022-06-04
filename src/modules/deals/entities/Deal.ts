import { User } from '@modules/users/entities/User';
import {
  Column,
  CreateDateColumn,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Client } from './Client';

@Entity('deals')
export class Deal {
  [key: string]: unknown;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pipedrive_id: number;

  @Column()
  title: string;

  @Column()
  value: number;

  @Column()
  product_count: number;

  @Column()
  user_pipedrive_id: number;

  @Column()
  client_id: string;

  @ManyToOne(() => Client, client => client.deals, {
    eager: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column()
  user_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  deal_date: Date;

  @CreateDateColumn()
  created_at: Date;
}
