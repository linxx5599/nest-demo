import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { FindSchoolDto } from './dto/find-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolPipe } from './school.pipe';
import { Request } from 'express';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto, @Req() req: Request) {
    const token = req.headers.authorization;
    return await this.schoolService.create(createSchoolDto, token);
  }

  @Get()
  async findAll(@Query(SchoolPipe) query: FindSchoolDto) {
    return await this.schoolService.findAll(query);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(SchoolPipe) updateSchoolDto: UpdateSchoolDto,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization;
    return await this.schoolService.update(id, updateSchoolDto, token);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const token = req.headers.authorization;
    return await this.schoolService.remove(id, token);
  }
}
