import { IsNotEmpty, IsBoolean } from 'class-validator';
export class CreateSchoolDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'id is required' })
  id: string;

  @IsBoolean({ message: 'enabled must be boolean' })
  enabled: boolean;
  constructor(enabled: boolean = null) {
    this.enabled = enabled === null ? true : enabled;
  }

  @IsNotEmpty({ message: 'createTime is required' })
  createTime: string;
}
