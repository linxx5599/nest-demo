import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  upload(file) {
    return 'This action adds a new file';
  }
}
