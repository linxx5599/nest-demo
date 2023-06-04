import {
  NestInterceptor,
  CallHandler,
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request, Response } from 'express';

interface Data<T> {
  data: T;
}

//成功返回统一处理结构
export class HttpResponse<T> implements NestInterceptor {
  intercept(context, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          status: 0,
          success: true,
          message: '操作成功',
        };
      }),
    );
  }
}

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    // const next = ctx.getNext<Request>();
    const status = exception.getStatus();
    res.status(status).json({
      success: false,
      time: new Date(),
      data: exception.message,
      status,
      path: req.url,
    });
  }
}

export function responseHttpStatusError(value) {
  return new HttpException(`${value} not exist`, HttpStatus.BAD_REQUEST);
}
