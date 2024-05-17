import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { responseHttpStatusError } from 'src/common/response';
import { FILE_STATIC } from 'src/common/config';
import { existsSync } from 'fs';
import { join } from 'path';
import { validateFileName } from 'src/common/validateFileName';

@Injectable()
export class FileUploadPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    await validateFileName(metadata.metatype, { fileName: value });
    return value;
  }
}

@Injectable()
export class FileDownloadPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    await validateFileName(metadata.metatype, { fileName: value });
    const existFile = await existsSync(
      join(__dirname, `../${FILE_STATIC}/${value}`),
    );
    if (!existFile)
      throw responseHttpStatusError(`file: 【${value}】 not exist`);
    return value;
  }
}
