import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryPersonnel } from '../../entities/delivery-personnel.entity';
import { Order } from '../../entities/order.entity';
import { CreateDeliveryPersonnelDto, UpdateLocationDto, AssignDeliveryDto, DeliveryStatusDto } from './delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(DeliveryPersonnel)
    private deliveryRepository: Repository<DeliveryPersonnel>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // Get all delivery personnel
  async findAll(): Promise<DeliveryPersonnel[]> {
    return this.deliveryRepository.find();
  }

  // Get active delivery personnel
  async findActive(): Promise<DeliveryPersonnel[]> {
    return this.deliveryRepository.find({ where: { isActive: true } });
  }

  // Get delivery person by ID
  async findOne(id: number): Promise<DeliveryPersonnel> {
    const deliveryPerson = await this.deliveryRepository.findOne({ where: { id } });
    if (!deliveryPerson) {
      throw new NotFoundException(`Delivery person with ID ${id} not found`);
    }
    return deliveryPerson;
  }

  // Get delivery person by profile ID
  async findByProfileId(profileId: string): Promise<DeliveryPersonnel | null> {
    return this.deliveryRepository.findOne({ where: { profileId } });
  }

  // Create new delivery personnel
  async create(createDto: CreateDeliveryPersonnelDto): Promise<DeliveryPersonnel> {
    const existing = await this.findByProfileId(createDto.profileId);
    if (existing) {
      throw new BadRequestException('Delivery person already exists for this profile');
    }

    const deliveryPerson = this.deliveryRepository.create({
      profileId: createDto.profileId,
      name: createDto.name,
      phone: createDto.phone,
      vehicleType: createDto.vehicleType,
      vehicleNumber: createDto.vehicleNumber,
      isActive: true,
      totalDeliveries: 0,
      rating: 5.0,
    });

    return this.deliveryRepository.save(deliveryPerson);
  }

  // Update delivery person's current location
  async updateLocation(id: number, locationDto: UpdateLocationDto): Promise<DeliveryPersonnel> {
    const deliveryPerson = await this.findOne(id);
    deliveryPerson.currentLat = locationDto.lat;
    deliveryPerson.currentLng = locationDto.lng;
    return this.deliveryRepository.save(deliveryPerson);
  }

  // Toggle active status
  async toggleActive(id: number, isActive: boolean): Promise<DeliveryPersonnel> {
    const deliveryPerson = await this.findOne(id);
    deliveryPerson.isActive = isActive;
    return this.deliveryRepository.save(deliveryPerson);
  }

  // Assign delivery person to an order
  async assignToOrder(assignDto: AssignDeliveryDto): Promise<Order> {
    const deliveryPerson = await this.findOne(assignDto.deliveryPersonId);
    
    if (!deliveryPerson.isActive) {
      throw new BadRequestException('Delivery person is not active');
    }

    const order = await this.orderRepository.findOne({ where: { id: assignDto.orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${assignDto.orderId} not found`);
    }

    if (order.status !== 'confirmed' && order.status !== 'preparing') {
      throw new BadRequestException(`Order cannot be assigned for delivery. Current status: ${order.status}`);
    }

    // Assign delivery person to order
    order.deliveryPersonId = deliveryPerson.profileId;
    order.status = 'out_for_delivery';
    
    // Calculate estimated delivery time (30 minutes from now)
    const estimatedTime = new Date();
    estimatedTime.setMinutes(estimatedTime.getMinutes() + 30);
    order.estimatedDeliveryTime = estimatedTime;

    // Increment delivery count
    deliveryPerson.totalDeliveries += 1;
    await this.deliveryRepository.save(deliveryPerson);

    return this.orderRepository.save(order);
  }

  // Get delivery status for an order
  async getDeliveryStatus(orderId: number): Promise<DeliveryStatusDto> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!order.deliveryPersonId) {
      throw new BadRequestException('No delivery person assigned to this order yet');
    }

    const deliveryPerson = await this.deliveryRepository.findOne({
      where: { profileId: order.deliveryPersonId },
    });

    if (!deliveryPerson) {
      throw new NotFoundException('Delivery person not found');
    }

    // Calculate estimated arrival time remaining
    let estimatedArrivalMinutes = 30;
    if (order.estimatedDeliveryTime) {
      const now = new Date();
      const estimated = new Date(order.estimatedDeliveryTime);
      const diffMinutes = Math.ceil((estimated.getTime() - now.getTime()) / (1000 * 60));
      estimatedArrivalMinutes = Math.max(0, diffMinutes);
    }

    return {
      orderId: order.id,
      deliveryPersonId: deliveryPerson.id,
      deliveryPersonName: deliveryPerson.name,
      deliveryPersonPhone: deliveryPerson.phone,
      estimatedArrivalMinutes: estimatedArrivalMinutes,
      currentLocation: {
        lat: deliveryPerson.currentLat || 30.0444,
        lng: deliveryPerson.currentLng || 31.2357,
      },
    };
  }

  // Mark delivery as completed
  async completeDelivery(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status !== 'out_for_delivery') {
      throw new BadRequestException(`Order is not out for delivery. Current status: ${order.status}`);
    }

    order.status = 'delivered';
    order.actualDeliveryTime = new Date();

    return this.orderRepository.save(order);
  }

  // Get delivery statistics
  async getStats(): Promise<any> {
    const total = await this.deliveryRepository.count();
    const active = await this.deliveryRepository.count({ where: { isActive: true } });
    const totalDeliveries = await this.deliveryRepository
      .createQueryBuilder('delivery')
      .select('SUM(delivery.totalDeliveries)', 'total')
      .getRawOne();

    const averageRating = await this.deliveryRepository
      .createQueryBuilder('delivery')
      .select('AVG(delivery.rating)', 'average')
      .getRawOne();

    return {
      totalPersonnel: total,
      activePersonnel: active,
      totalDeliveriesCompleted: totalDeliveries?.total || 0,
      averageRating: parseFloat(averageRating?.average || 0).toFixed(1),
    };
  }
}