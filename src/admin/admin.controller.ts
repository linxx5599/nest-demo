import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminPipe } from './admin.pipe';
import { FindAdminDto } from 'src/admin/dto/find-admin.dto';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body(AdminPipe) createAdminDto: CreateAdminDto, @Req() req: Request) {
    return this.adminService.create(createAdminDto, req);
  }

  @Get()
  async findAll(@Query(AdminPipe) query: FindAdminDto, @Req() req: Request) {
    return await this.adminService.findAll(query, req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }
}
