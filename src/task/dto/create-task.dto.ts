import { IsNotEmpty } from 'class-validator';
export class CreateTaskDto {
  @IsNotEmpty({ message: '任务名称不能为空' })
  name: string;

  @IsNotEmpty({ message: '任务内容不能为空' })
  content: string;
}
