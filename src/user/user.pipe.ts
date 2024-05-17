import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validateFileName } from 'src/common/validateFileName';

@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    await validateFileName(metadata.metatype, value);
    return value;
  }
}
