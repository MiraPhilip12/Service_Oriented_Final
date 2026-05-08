import { Controller, Get, Post, Put, Body, Param, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('my-orders')
  async getMyOrders(@Request() req: any) {
    const customerId = req.headers['x-user-id'] || 'test-user';
    return this.orderService.findCustomerOrders(customerId);
  }

  @Get('stats/sales')
  async getSalesTotal() {
    return { totalSales: await this.orderService.getSalesTotal() };
  }

  @Get('stats/count')
  async getOrderCount() {
    return { orderCount: await this.orderService.getOrderCount() };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Get(':id/items')
  async getOrderItems(@Param('id') id: string) {
    return this.orderService.getOrderItems(+id);
  }

  @Post()
  async create(@Body() createDto: CreateOrderDto, @Request() req: any) {
    const customerId = req.headers['x-user-id'] || 'test-user';
    return this.orderService.create(customerId, createDto);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(+id, updateDto);
  }

  @Put(':id/assign-delivery/:deliveryPersonId')
  async assignDelivery(@Param('id') id: string, @Param('deliveryPersonId') deliveryPersonId: string) {
    return this.orderService.assignDeliveryPerson(+id, deliveryPersonId);
  }
}