import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('marcadores')
export class Marcador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  cor: string; // Armazenará o Hexadecimal (ex: #ff0000)

  @Column({ nullable: true })
  descricao: string;

  // Tabela de ligação para saber quais linhas de quais planilhas têm este marcador
  @Column({ type: 'jsonb', default: [] })
  vinculos: { planilhaId: number; linhaIndex: number }[];
}
