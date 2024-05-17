import { IsNotEmpty } from 'class-validator';
export class AppDto {
  @IsNotEmpty({ message: 'account is required' })
  account: string;

  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
