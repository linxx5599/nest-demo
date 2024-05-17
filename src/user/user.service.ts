import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { forkJoin } from 'rxjs';
import { responseHttpStatusError } from 'src/common/response';
import { getUserInfo, verifySuperAdmin } from 'src/common/share';
import { AdminService } from 'src/admin/admin.service';
import { SchoolService } from 'src/school/school.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    @Inject(AdminService) private readonly adminService: AdminService,
    @Inject(SchoolService) private readonly schoolService: SchoolService,
  ) {}

  async validateUnique(account: string, schoolId: string) {
    let findData;
    try {
      findData = await this.findOne({ account });
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    let pre = true;
    if (!findData) {
      const system = await this.adminService.findOne(account);
      pre = !!system;
    }
    if (pre) {
      throw responseHttpStatusError(`${account} 已存在`);
    }
    const school = await this.schoolService.findOne({ id: schoolId });
    if (!school) {
      throw responseHttpStatusError(`${schoolId} 学院不存在`);
    }
    return school;
  }

  async create(createUserDto: CreateUserDto) {
    const { name } = await this.validateUnique(
      createUserDto.account,
      createUserDto.schoolId,
    );
    const data = new User();
    data.account = createUserDto.account;
    data.name = createUserDto.name || createUserDto.account;
    data.password = createUserDto.password;
    data.schoolId = createUserDto.schoolId;
    data.schoolName = name;
    data.sex = createUserDto.sex * 1;
    try {
      await this.user.save(data);
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne({ id, account }: { id?: string; account?: string }) {
    try {
      return await this.user.findOne({ where: { id, account } });
    } catch (error) {
      throw responseHttpStatusError(`不存在`);
    }
  }
  async findAll({ name, page = 1, size = 10 }: FindUserDto, req?: Request) {
    const token = req.headers.authorization;
    verifySuperAdmin(token);
    size = size * 1;
    page = page * 1;
    const where = {
      name: Like(`%${name ?? ''}%`),
    };
    try {
      return await new Promise((resolve) => {
        forkJoin([
          this.user.find({
            where,
            skip: (page - 1) * size,
            take: size,
            select: [
              'createTime',
              'id',
              'name',
              'sex',
              'enabled',
              'money',
              'phone',
              'schoolId',
              'schoolName',
              'account',
            ],
          }),
          this.user.count({ where }),
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

  async getInfo(token) {
    try {
      const { system, account, super: issuper } = getUserInfo(token);
      if (system) {
        return {
          system: true,
          super: issuper,
          ...(await this.adminService.findOne(account)),
        };
      }
      return {
        system: false,
        super: false,
        ...(await this.findOne({ account })),
      };
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, token) {
    verifySuperAdmin(token);
    try {
      await this.user.update(
        { id },
        {
          enabled: Reflect.has(updateUserDto, 'enabled')
            ? updateUserDto.enabled
            : true,
        },
      );
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
