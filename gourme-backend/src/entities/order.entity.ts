import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ default: 'pending' })
  paymentStatus: string;

  @Column()
  deliveryAddress: string;

  @Column({ type: 'float', nullable: true })
  deliveryLat: number;

  @Column({ type: 'float', nullable: true })
  deliveryLng: number;

  @Column({ nullable: true })
  deliveryPersonId: string;

  @Column({ nullable: true })
  estimatedDeliveryTime: Date;

  @Column({ nullable: true })
  actualDeliveryTime: Date;  // ✅ ADD THIS LINE - the missing property

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}