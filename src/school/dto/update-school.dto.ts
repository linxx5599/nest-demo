import { IsBoolean } from 'class-validator';

export class UpdateSchoolDto {
  @IsBoolean({ message: 'enabled must be boolean' })
  enabled: boolean;
  constructor(enabled: boolean = null) {
    this.enabled = enabled === null ? true : enabled;
  }
}
