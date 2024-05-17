import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserPipe } from './user.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(UserPipe) body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get()
  findAll(@Query(UserPipe) query: FindUserDto, @Req() req: Request) {
    return this.userService.findAll(query, req);
  }

  @Get('/info')
  async getInfo(@Req() req: Request) {
    const token = req.headers.authorization;
    const info = await this.userService.getInfo(token);
    return info;
  }

  @Get('/info/:id')
  async getUserInfo(@Param('id') id: string) {
    return await this.userService.findOne({ id });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(UserPipe) updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization;
    return await this.userService.update(id, updateUserDto, token);
  }
}
