import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Repository } from 'typeorm';
import { AppDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async findOneBy(register: AppDto) {
    const findUser = await this.userRepository.findOneBy({
      account: register.account,
      password: register.password,
    });
    return findUser;
  }
}
