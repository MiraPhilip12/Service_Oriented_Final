import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { RegisterDto, LoginDto, LoginResponseDto } from './auth.dto';

// Since Supabase handles auth, we'll simulate with JWT
// In production, use Supabase Auth client

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Generate a simple ID (in production use UUID from Supabase)
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newUser = this.userRepository.create({
      id: userId,
      email: registerDto.email,
      fullName: registerDto.fullName,
      phone: registerDto.phone,
      address: registerDto.address,
      role: registerDto.role || 'customer',
    });

    await this.userRepository.save(newUser);

    // Generate JWT token
    const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // In a real implementation, you'd verify with Supabase Auth
    // For now, we'll accept any password for testing
    // In production, use Supabase's auth.signIn()

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}