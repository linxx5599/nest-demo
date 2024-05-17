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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskDto } from './dto/find-task.dto';

import { TaskPipe, TaskUpdatePipe } from './task.pipe';
import { Request } from 'express';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body(TaskPipe) createTaskDto: CreateTaskDto, @Req() req: Request) {
    return this.taskService.create(createTaskDto, req);
  }

  @Get()
  async findAll(@Query(TaskPipe) query: FindTaskDto, @Req() req: Request) {
    return await this.taskService.findAll(query, req);
  }

  //获取当前用户发布任务列表
  @Get('/publlish')
  async findPubllishAll(
    @Query(TaskPipe) query: FindTaskDto,
    @Req() req: Request,
  ) {
    return await this.taskService.findAll(query, req, 'publlish');
  }

  //获取当前用户已接受任务列表
  @Get('/accpet')
  async findAccpetAll(
    @Query(TaskPipe) query: FindTaskDto,
    @Req() req: Request,
  ) {
    return await this.taskService.findAll(query, req, 'accpet');
  }
  //接受任务
  @Post('/accpet')
  async createAccpet(@Body(TaskPipe) body: string[], @Req() req: Request) {
    return await this.taskService.createAccpet(body, req);
  }

  @Get(':taskId')
  async findOne(@Param('taskId') taskId: string) {
    return await this.taskService.findOne({ taskId });
  }

  @Patch(':taskId')
  async update(
    @Param('taskId') taskId: string,
    @Body(TaskUpdatePipe) body: UpdateTaskDto,
    @Req() req: Request,
  ) {
    return await this.taskService.update(taskId, body, req);
  }

  @Delete(':taskId')
  async remove(@Param('taskId') taskId: string, @Req() req) {
    return await this.taskService.remove(taskId, req);
  }
}
