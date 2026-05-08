import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../../entities/feedback.entity';
import { CreateFeedbackDto } from './feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByCustomer(customerId: string): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrder(orderId: number): Promise<Feedback | null> {
    return this.feedbackRepository.findOne({ where: { orderId } });
  }

  async getAverageRating(): Promise<number> {
    const result = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .select('AVG(feedback.rating)', 'average')
      .getRawOne();
    return result?.average || 0;
  }

  async create(customerId: string, createDto: CreateFeedbackDto): Promise<Feedback> {
    const existing = await this.findByOrder(createDto.orderId);
    if (existing) {
      throw new Error('Feedback already exists for this order');
    }

    const feedback = this.feedbackRepository.create({
      orderId: createDto.orderId,
      customerId,
      rating: createDto.rating,
      comment: createDto.comment,
    });
    return this.feedbackRepository.save(feedback);
  }
}