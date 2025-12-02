import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  actor: string; // operator or system

  @Column({ type: 'varchar', length: 255 })
  action: string;

  @Column({ type: 'json', nullable: true })
  meta: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}


