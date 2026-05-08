import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('delivery_personnel')
export class DeliveryPersonnel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  profileId: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'float', nullable: true })
  currentLat: number;

  @Column({ type: 'float', nullable: true })
  currentLng: number;

  @Column({ default: 0 })
  totalDeliveries: number;

  @Column({ type: 'float', default: 5.0 })
  rating: number;

  @Column({ nullable: true })
  vehicleType: string;

  @Column({ nullable: true })
  vehicleNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}