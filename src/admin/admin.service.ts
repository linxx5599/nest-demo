import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Like, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import systemUser from 'src/systemUser';
import { forkJoin } from 'rxjs';
import { verifySuperAdmin } from 'src/common/share';
import { FindAdminDto } from './dto/find-admin.dto';
import { Request } from 'express';
import { responseHttpStatusError } from 'src/common/response';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly admin: Repository<Admin>,
  ) {
    this.createDefaultAdmin();
  }

  createDefaultAdmin() {
    //判断生成默认管理员用户
    systemUser.forEach(async (user) => {
      const admin = await this.findOne(user.account);
      if (!admin) {
        const newAdmin = new Admin();
        newAdmin.name = user.name;
        newAdmin.account = user.account;
        newAdmin.password = user.password;
        await this.admin.save(newAdmin);
      }
    });
  }

  async create(createAdminDto: CreateAdminDto, req?: Request) {
    const token = req.headers.authorization;
    verifySuperAdmin(token, true);
    const item = await this.findOne(createAdminDto.account);
    if (item) {
      throw responseHttpStatusError('账号已存在');
    }
    const data = new Admin();
    data.account = createAdminDto.account;
    data.name = createAdminDto.name;
    data.password = createAdminDto.password;
    return this.admin.save(data);
  }

  async findAll({ name, page = 1, size = 10 }: FindAdminDto, req?: Request) {
    const token = req.headers.authorization;
    verifySuperAdmin(token, true);
    size = size * 1;
    page = page * 1;
    const where = {
      name: Like(`%${name ?? ''}%`),
    };
    try {
      return await new Promise((resolve) => {
        forkJoin([
          this.admin.find({
            where,
            skip: (page - 1) * size,
            take: size,
            select: ['createTime', 'id', 'name', 'account'],
          }),
          this.admin.count({ where }),
        ]).subscribe(([records, total]) => {
          resolve({
            records,
            size,
            page,
            total,
          });
        });
      });
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneBy(register: CreateAdminDto) {
    const findUser = await this.admin.findOneBy({
      account: register.account,
      password: register.password,
    });
    return findUser;
  }

  async findOne(account: string) {
    try {
      return await this.admin.findOne({ where: { account } });
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  update(id: string, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }
}
