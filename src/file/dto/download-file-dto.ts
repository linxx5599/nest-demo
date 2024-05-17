import { IsNotEmpty, IsString } from 'class-validator';
export class downloadFileDto {
  @IsNotEmpty({
    message: 'fileName is required',
  })
  @IsString({
    message: 'fileName is string',
  })
  fileName: string;
}
