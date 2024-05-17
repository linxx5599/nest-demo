import { IsNotEmpty } from 'class-validator';
import { isValidaor } from 'src/common/commonDto';

export class CreateUserDto {
  @IsNotEmpty({ message: 'account is required' })
  account: string;

  name?: string;

  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @IsNotEmpty({ message: 'schoolId is required' })
  schoolId;

  @isValidaor({ message: 'sex must be 0 or 1' }, [0, 1])
  sex;
}

export class LoginUserDto {
  @IsNotEmpty({ message: 'account is required' })
  account: string;

  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
