import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum SensitiveWordType {
  LEGAL = 'legal',
  GOVERNMENT = 'government',
  OTHER = 'other',
}

@Entity('sensitive_words')
export class SensitiveWord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  word: string;

  @Column({
    type: 'varchar',
    length: 32,
    default: 'other',
  })
  type: SensitiveWordType;

  @Column({ type: 'tinyint', default: 5 })
  severity: number; // 1-10

  @Column({ type: 'tinyint', default: 1 })
  enabled: number; // 0 or 1

  @CreateDateColumn()
  created_at: Date;
}


