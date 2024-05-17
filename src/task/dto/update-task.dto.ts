import { isValidaor } from 'src/common/commonDto';

export class UpdateTaskDto {
  @isValidaor({ message: 'status must be 0, 1, 2 or 3' }, [0, 1, 2, 3])
  status: number;
}
