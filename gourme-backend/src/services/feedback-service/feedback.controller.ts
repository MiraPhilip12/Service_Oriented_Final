import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  async findAll() {
    return this.feedbackService.findAll();
  }

  @Get('stats/average')
  async getAverageRating() {
    return { averageRating: await this.feedbackService.getAverageRating() };
  }

  @Get('my-feedback')
  async getMyFeedback(@Request() req: any) {
    const customerId = req.headers['x-user-id'] || 'test-user';
    return this.feedbackService.findByCustomer(customerId);
  }

  @Get('order/:orderId')
  async findByOrder(@Param('orderId') orderId: string) {
    return this.feedbackService.findByOrder(+orderId);
  }

  @Post()
  async create(@Body() createDto: CreateFeedbackDto, @Request() req: any) {
    const customerId = req.headers['x-user-id'] || 'test-user';
    return this.feedbackService.create(customerId, createDto);
  }
}