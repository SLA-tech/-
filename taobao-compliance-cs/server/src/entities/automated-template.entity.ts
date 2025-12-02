import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('automated_templates')
export class AutomatedTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'text' })
  content: string; // JSON string for text/image

  @Column({ type: 'int', default: 60 })
  loop_interval: number; // seconds

  @Column({ type: 'int', default: 0 })
  max_loops: number; // 0 means unlimited

  @Column({ type: 'varchar', length: 255, nullable: true })
  keywords: string; // comma-separated keywords for FAQ matching

  @Column({ type: 'tinyint', default: 1 })
  enabled: number; // 0 or 1

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


