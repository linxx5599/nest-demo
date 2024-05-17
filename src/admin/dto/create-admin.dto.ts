import { IsNotEmpty } from 'class-validator';
export class CreateAdminDto {
  name?: string;

  @IsNotEmpty()
  account: string;

  @IsNotEmpty()
  password: string;
}
