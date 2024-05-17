import {
  Injectable,
  CanActivate,
  HttpException,
  HttpStatus,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './jwtConfig';
import { Request } from 'express';
import { isArray } from './share';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('REDIS') private readonly redis) {}
  // 全局守卫
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求头部数据
    const request: Request = context.switchToHttp().getRequest();
    // 白名单验证
    if (this.hasUrl(this.urlList, request)) {
      return true;
    }
    // 获取请求头中的 authorization 字段
    let token = context.switchToRpc().getData().headers.authorization;
    // 验证token的合理性以及根据token做响应的操作
    if (token) {
      token = token.replace('Bearer ', '');
      try {
        // 校验 token
        const jwtService = new JwtService();
        const res = jwtService.verify(token, jwtConfig);
        const _token = await this.redis.get(res.account);
        if (_token !== token) {
          throw 'redis';
        }
        return res;
      } catch (e) {
        throw new HttpException(
          e === 'redis' ? '登录已超时' : '没有授权访问，请先登陆',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException(
        '没有授权访问，请先登陆',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  // 白名单
  private urlList = ['/login', ['/user', ['POST']], ['/school', ['GET']]];

  // 验证请求是否为白名单的路由
  private hasUrl(urlList, request: Request): boolean {
    const { url: _url, method: _method } = request;
    for (let i = 0; i < urlList.length; i++) {
      let item = urlList[i];
      if (!isArray(item)) item = [item];
      const [url, methods] = item;
      if (_url.indexOf(url.split('?')[0]) >= 0) {
        if (methods && methods.length) {
          return methods.some(
            (type) => type.toLocaleLowerCase() === _method.toLocaleLowerCase(),
          );
        }
        return true;
      }
    }
    return false;
  }
}
