import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { validateErrors } from 'src/common/validateErrors';
import { responseHttpStatusError } from 'src/common/response';
import { FILE_STATIC } from 'src/common/config';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileDownloadPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const DTO = plainToInstance(metadata.metatype, { fileName: value });
    const errors = await validate(DTO);
    if (errors.length) throw responseHttpStatusError(validateErrors(errors));
    const existFile = await existsSync(
      join(__dirname, `../${FILE_STATIC}/${value}`),
    );
    if (!existFile) throw responseHttpStatusError(value);
    return value;
  }
}
