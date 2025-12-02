import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  OTHER = 'other',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  session_id: number;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'session_id' })
  session: User;

  @Column({
    type: 'varchar',
    length: 16,
  })
  direction: MessageDirection;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'varchar',
    length: 16,
    default: ContentType.TEXT,
  })
  content_type: ContentType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  matched_rules: string;

  @CreateDateColumn()
  created_at: Date;
}


