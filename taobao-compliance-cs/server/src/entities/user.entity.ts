import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Message } from './message.entity';

export enum SessionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  BLOCKED = 'blocked',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  taobao_user_id: string;

  @Column({
    type: 'varchar',
    length: 32,
    default: SessionStatus.OPEN,
  })
  current_status: SessionStatus;

  @Column({ type: 'tinyint', default: 0 })
  risk_level: number; // 0-低，1-中，2-高

  @OneToMany(() => Message, (message) => message.session)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


