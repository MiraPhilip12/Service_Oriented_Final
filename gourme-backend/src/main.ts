import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend - FIXED CONFIGURATION
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    exposedHeaders: ['Authorization'],
  });
  
  // Global prefix for API
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log(`🚀 API Gateway running on: http://localhost:3000`);
  console.log(`📍 CORS enabled for: http://localhost:3001`);
}
bootstrap();