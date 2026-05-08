import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findCustomerOrders(customerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItemRepository.find({ where: { orderId } });
  }

  async create(customerId: string, createDto: CreateOrderDto): Promise<Order> {
    const totalAmount = createDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const newOrder = this.orderRepository.create({
      customerId,
      totalAmount,
      deliveryAddress: createDto.deliveryAddress,
      deliveryLat: createDto.deliveryLat,
      deliveryLng: createDto.deliveryLng,
      paymentMethod: createDto.paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    });

    const savedOrder = await this.orderRepository.save(newOrder);

    // Save order items
    for (const item of createDto.items) {
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtTime: item.price,
        name: item.name,
      });
      await this.orderItemRepository.save(orderItem);
    }

    return savedOrder;
  }

  async updateStatus(id: number, updateDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = updateDto.status;
    
    if (updateDto.status === 'delivered') {
      order.actualDeliveryTime = new Date(); // This now works because property exists
    }
    
    return this.orderRepository.save(order);
  }

  async assignDeliveryPerson(orderId: number, deliveryPersonId: string): Promise<Order> {
    const order = await this.findOne(orderId);
    order.deliveryPersonId = deliveryPersonId;
    return this.orderRepository.save(order);
  }

  async getSalesTotal(): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: 'delivered' })
      .getRawOne();
    return result?.total || 0;
  }

  async getOrderCount(): Promise<number> {
    return this.orderRepository.count();
  }
}