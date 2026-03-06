import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('planilhas')
export class Planilha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomeOriginal: string;

  @Column({ type: 'jsonb' })
  dados: any;

  @CreateDateColumn()
  dataUpload: Date;
}