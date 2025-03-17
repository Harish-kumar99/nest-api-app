import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(name: string, mobile: string, password: string) {
    const user = this.usersRepository.create({
      name,
      mobile,
      password,
    });
    return this.usersRepository.save(user);
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { mobile } });
  }
}
