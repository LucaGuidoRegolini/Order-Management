import {
  Column,
  CreateDateColumn,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Client } from './Client';

@Entity('emails')
export class Email {
  [key: string]: unknown;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @ManyToOne(() => Client, client => client.emails)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @CreateDateColumn()
  created_at: Date;
}
