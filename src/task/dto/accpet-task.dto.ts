import { ArrayNotEmpty } from 'class-validator';
export class AccpetTaskDto {
  @ArrayNotEmpty({ message: 'taskIds must be an array' })
  taskIds: Array<string>;
}
