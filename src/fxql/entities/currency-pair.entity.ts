import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('currency_pairs')
export class CurrencyPair {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 3 })
  sourceCurrency: string;

  @Column({ length: 3 })
  destinationCurrency: string;

  @Column('decimal', { precision: 10, scale: 4 })
  buyPrice: number;

  @Column('decimal', { precision: 10, scale: 4 })
  sellPrice: number;

  @Column('integer')
  capAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}