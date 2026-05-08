import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('profiles')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ default: 'customer' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}