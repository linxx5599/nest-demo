import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { validateErrors } from 'src/common/validateErrors';
import { responseHttpStatusError } from 'src/common/response';

export async function validateFileName(metatype, obj) {
  const DTO = plainToInstance(metatype, obj);
  const errors = await validate(DTO);
  if (errors.length) throw responseHttpStatusError(validateErrors(errors));
}
