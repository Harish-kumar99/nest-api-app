import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/user.service';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private generateHash(payload: string): string {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error('Secret key is not defined');
    }
    return crypto
      .createHmac('sha256', secretKey)
      .update(payload)
      .digest('hex');
  }

  async validateUser(mobile: string, password: string) {
    const user = await this.usersService.findByMobile(mobile);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const hashedPassword = this.generateHash(password);
    if (user && hashedPassword === user.password) {
      return {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        status: user.status,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      status: user.status,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async signup(name: string, mobile: string, password: string) {
    const existingUser = await this.usersService.findByMobile(mobile);
    if (existingUser) {
      throw new ConflictException('Mobile number already exists');
    }

    const hashedPassword = this.generateHash(password);
    const newUser = await this.usersService.createUser(
      name,
      mobile,
      hashedPassword,
    );

    return {
      id: newUser.id,
      name: newUser.name,
      mobile: newUser.mobile,
      status: newUser.status,
    };
  }
}
