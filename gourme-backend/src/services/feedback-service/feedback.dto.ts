export class CreateFeedbackDto {
  orderId: number;
  rating: number;
  comment?: string;
}

export class FeedbackResponseDto {
  id: number;
  orderId: number;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}