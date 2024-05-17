import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  Body,
} from '@nestjs/common';
import { downloadFileDto } from './dto/download-file-dto';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { FileDownloadPipe } from './file.pipe';
import { zip } from 'compressing';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file, @Body('fileName') fileName) {
    console.log(fileName, 'fileName');

    return this.fileService.upload(fileName);
  }

  @Get('download')
  async download(
    @Res() res: Response,
    @Query('fileName', FileDownloadPipe) fileName: downloadFileDto,
  ) {
    const url = join(__dirname, `../fileStatic/${fileName}`);
    const tarStream = new zip.Stream();
    await tarStream.addEntry(url);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${Date.now()}`);
    tarStream.pipe(res);
  }
}
