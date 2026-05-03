export class RegisterDto {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
  address?: string;
  role?: 'customer' | 'admin';
}

export class LoginDto {
  email: string;
  password: string;
}

export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}