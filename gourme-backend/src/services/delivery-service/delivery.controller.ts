import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryPersonnelDto, UpdateLocationDto, AssignDeliveryDto } from './delivery.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // Get all delivery personnel
  @Get('personnel')
  async findAll() {
    return this.deliveryService.findAll();
  }

  // Get active delivery personnel
  @Get('personnel/active')
  async findActive() {
    return this.deliveryService.findActive();
  }

  // Get delivery person by ID
  @Get('personnel/:id')
  async findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(+id);
  }

  // Create new delivery personnel
  @Post('personnel')
  async create(@Body() createDto: CreateDeliveryPersonnelDto) {
    return this.deliveryService.create(createDto);
  }

  // Update delivery person location
  @Put('personnel/:id/location')
  async updateLocation(@Param('id') id: string, @Body() locationDto: UpdateLocationDto) {
    return this.deliveryService.updateLocation(+id, locationDto);
  }

  // Toggle active status
  @Put('personnel/:id/active')
  async toggleActive(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.deliveryService.toggleActive(+id, body.isActive);
  }

  // Assign delivery person to an order
  @Post('assign')
  async assignToOrder(@Body() assignDto: AssignDeliveryDto) {
    return this.deliveryService.assignToOrder(assignDto);
  }

  // Get delivery status for an order
  @Get('status/:orderId')
  async getDeliveryStatus(@Param('orderId') orderId: string) {
    return this.deliveryService.getDeliveryStatus(+orderId);
  }

  // Mark delivery as completed
  @Put('complete/:orderId')
  async completeDelivery(@Param('orderId') orderId: string) {
    return this.deliveryService.completeDelivery(+orderId);
  }

  // Get delivery statistics
  @Get('stats')
  async getStats() {
    return this.deliveryService.getStats();
  }
}