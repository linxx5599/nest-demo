import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { responseHttpStatusError } from 'src/common/response';
import { LoginUserDto } from 'src/user/dto/create-user.dto';
import { UserPipe } from 'src/user/user.pipe';
import { superRow } from './systemUser';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
    @Inject('REDIS') private readonly redis,
  ) {}

  @Post('login')
  async login(@Body(UserPipe) body: LoginUserDto) {
    const { account, password } = body;
    let info;
    try {
      info = await this.appService.findOneBy({ account, password });
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    let system;
    if (!info) {
      try {
        //查询系统用户
        system = await this.adminService.findOneBy({ account, password });
      } catch (error) {
        throw new HttpException(
          '服务器内部报错',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (!system) throw responseHttpStatusError('账号或密码错误');
    }
    try {
      const commonObj = {
        system: !!system,
        super: system ? system.account === superRow.account : false,
      };
      const token = this.jwtService.sign({
        ...commonObj,
        account: body.account,
        id: info ? info.id : system.id,
        password: body.password,
      });
      await this.redis.set('setex', body.account, 1 * 60 * 60 * 4, token);
      return {
        token,
        data: info || system,
        ...commonObj,
      };
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
