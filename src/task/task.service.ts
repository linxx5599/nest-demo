import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
import { Task } from './entities/task.entity';
import { Repository, Like, FindOperator, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { responseHttpStatusError } from 'src/common/response';
import { forkJoin } from 'rxjs';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { getUserInfo } from 'src/common/share';

const statusMap = {
  0: '待解决',
  1: '解决中',
  2: '已完成',
  3: '已关闭',
};

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly task: Repository<Task>,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async checkTask(req: Request) {
    const token = req.headers.authorization;
    const { id } = getUserInfo(token);
    const userInfo = await this.userService.findOne({ id });
    if (!userInfo.enabled) {
      throw responseHttpStatusError(`用户已限制不可操作`);
    }
    return userInfo;
  }

  async create(createTaskDto: CreateTaskDto, req) {
    const { name, content } = createTaskDto;
    const token = req.headers.authorization;
    //当前用户信息
    const { id, account } = getUserInfo(token);
    const data = new Task();
    data.publlishUserId = id;
    data.publlishUserName = account;
    data.content = content;
    data.taskName = name;
    try {
      return this.task.save(data);
    } catch (error) {
      throw responseHttpStatusError(error);
    }
  }

  //接受任务
  async createAccpet(taskIds: string[], req: Request) {
    const { id, account } = await this.checkTask(req);
    const allTask = await this.task.findBy({ taskId: In(taskIds) });
    for (const item of allTask) {
      if (item.status !== 0 || item.accpetUserId) {
        throw responseHttpStatusError('只有待解决才能接受任务');
      }
      if (item.publlishUserId === id) {
        throw responseHttpStatusError('不能接受自己发布的任务');
      }
    }
    try {
      await this.task.update(
        { taskId: In(taskIds) },
        { status: 1, accpetUserId: id, accpetUserName: account },
      );
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    { taskName, page = 1, size = 10 }: FindTaskDto,
    req: Request,
    type?: string,
  ) {
    size = size * 1;
    page = page * 1;
    const where: {
      taskName: FindOperator<string>;
      status?: number;
      publlishUserId?: FindOperator<string>;
      accpetUserId?: string;
    } = {
      taskName: Like(`%${taskName ?? ''}%`),
    };
    const token = req.headers.authorization;
    const id = getUserInfo(token).id;
    //publlish发布任务则查询自己; accpet查询接受任务
    if (['publlish', 'accpet'].includes(type)) {
      const wKeyMap = {
        publlish: 'publlishUserId',
        accpet: 'accpetUserId',
      };
      where[wKeyMap[type]] = id;
    } else {
      where.status = 0;
    }

    try {
      return await new Promise((resolve) => {
        forkJoin([
          this.task.find({
            where,
            skip: (page - 1) * size,
            take: size,
          }),
          this.task.count({ where }),
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

  async findOne({ taskId, taskName }: { taskId?: string; taskName?: string }) {
    try {
      return await this.task.findOne({ where: { taskId, taskName } });
    } catch (error) {
      throw responseHttpStatusError(`id 不存在`);
    }
  }
  async validateUnique(taskId: string) {
    const findData = await this.findOne({ taskId });
    if (!findData) {
      throw responseHttpStatusError(`${taskId} 不存在`);
    }
    return findData;
  }
  async update(taskId: string, body: UpdateTaskDto, req: Request) {
    const { id } = await this.checkTask(req);
    const { status, publlishUserId } = await this.validateUnique(taskId);
    if (id !== publlishUserId) {
      throw responseHttpStatusError(`${taskId} 不是你的任务`);
    }
    if ([2, 3].includes(status)) {
      throw responseHttpStatusError(`${statusMap[status]}状态不可修改`);
    }
    try {
      await this.task.update({ taskId }, { status: body.status });
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(taskId: string, req: Request) {
    const taskInfo = await this.findOne({ taskId });
    if (!taskInfo) {
      throw responseHttpStatusError(`${taskId} 不存在`);
    }
    if (taskInfo.status !== 0) {
      throw responseHttpStatusError(`只有待解决状态才可取消任务`);
    }

    const token = req.headers.authorization;
    //当前用户信息
    const { id, system } = getUserInfo(token);
    if (!system) {
      //是否有权限删除
      if (id !== taskInfo.publlishUserId) {
        throw responseHttpStatusError(`只有已发布任务的用户才可取消`);
      }
    }

    try {
      await this.task.delete(taskId);
    } catch (error) {
      throw new HttpException(
        '服务器内部报错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
