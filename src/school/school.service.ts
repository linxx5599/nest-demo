import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { FindSchoolDto } from './dto/find-school.dto';
import { responseHttpStatusError } from 'src/common/response';
import { School } from './entities/school.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { forkJoin } from 'rxjs';
import { verifySuperAdmin } from 'src/common/share';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School) private readonly school: Repository<School>,
  ) {}

  async validateUnique({ name, id }: { id?: string; name?: string }) {
    const findData = await this.findOne({ name, id });
    if (findData) {
      throw responseHttpStatusError(`${name || id}已存在`);
    }
  }

  async create(createUserDto: CreateSchoolDto, token) {
    verifySuperAdmin(token);
    await this.validateUnique({ name: createUserDto.name });
    await this.validateUnique({ id: createUserDto.id });
    const data = new School();
    data.name = createUserDto.name;
    data.id = createUserDto.id;
    data.createTime = createUserDto.createTime;
    data.enabled = Reflect.has(createUserDto, 'enabled')
      ? createUserDto.enabled
      : true;
    try {
      await this.school.save(data);
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({ name, page = 1, size = 10 }: FindSchoolDto) {
    size = size * 1;
    page = page * 1;
    const where = {
      name: Like(`%${name ?? ''}%`),
    };
    try {
      return await new Promise((resolve) => {
        forkJoin([
          this.school.find({
            where,
            skip: (page - 1) * size,
            take: size,
          }),
          this.school.count({ where }),
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
  async findOne({ id, name }: { id?: string; name?: string }) {
    try {
      return await this.school.findOne({ where: { id, name } });
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(id: string, updateSchoolDto: UpdateSchoolDto, token) {
    verifySuperAdmin(token);
    const data = await this.findOne({ id });
    try {
      await this.school.update(data, {
        enabled: Reflect.has(updateSchoolDto, 'enabled')
          ? updateSchoolDto.enabled
          : true,
      });
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, token) {
    verifySuperAdmin(token);
    try {
      await this.school.delete(id);
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
