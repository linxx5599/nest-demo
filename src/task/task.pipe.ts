import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validateFileName } from 'src/common/validateFileName';
import { plainToInstance } from 'class-transformer';
import { responseHttpStatusError } from 'src/common/response';

@Injectable()
export class TaskPipe implements PipeTransform {
  async transform(value: object, metadata: ArgumentMetadata) {
    await validateFileName(metadata.metatype, value);
    return value;
  }
}
const statusMap = {
  0: '待解决',
  1: '解决中',
  2: '已完成',
  3: '已关闭',
};
@Injectable()
export class TaskUpdatePipe implements PipeTransform {
  async transform(value: object, metadata: ArgumentMetadata) {
    await validateFileName(metadata.metatype, value);
    const DTO = plainToInstance(metadata.metatype, value);
    if ([0].includes(DTO.status)) {
      throw responseHttpStatusError(`不可修改为${statusMap[DTO.status]}状态`);
    }
    return value;
  }
}
