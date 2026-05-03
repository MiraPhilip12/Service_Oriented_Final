import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('SUPABASE_HOST'),
        port: configService.get('SUPABASE_PORT'),
        username: configService.get('SUPABASE_USER'),
        password: configService.get('SUPABASE_PASSWORD'),
        database: configService.get('SUPABASE_DATABASE'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // Set to false in production
        ssl: true, // Required for Supabase
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}