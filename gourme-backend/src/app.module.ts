import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './services/auth-service/auth.module';
import { MenuModule } from './services/menu-service/menu.module';
import { OrderModule } from './services/order-service/order.module';
import { FeedbackModule } from './services/feedback-service/feedback.module';
import { DeliveryModule } from './services/delivery-service/delivery.module'; // ✅ ADD THIS

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    MenuModule,
    OrderModule,
    FeedbackModule,
    DeliveryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}