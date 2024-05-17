import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './jwtConfig';
import { superRow } from 'src/systemUser';

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

interface JwtPayload {
  account: string;
  password: string;
  id: string;
  system: boolean;
  super: boolean;
}
/**
 * 通过token 获取用户详情信息
 * @param {string} token
 */
export function getUserInfo(token): JwtPayload {
  if (!token) {
    throw new HttpException('登录已超时', HttpStatus.UNAUTHORIZED);
  }
  token = token.replace('Bearer ', '');
  try {
    const jwtService = new JwtService();
    return jwtService.verify(token, jwtConfig);
  } catch (error) {
    throw new HttpException('无效token', HttpStatus.UNAUTHORIZED);
  }
}

//校验是否是admin默认管理员
export function verifySuperAdmin(token, isSuper?: boolean) {
  const { system, account } = getUserInfo(token);
  //超级管理员才能创建 更改
  if (isSuper && account !== superRow.account) {
    throw new HttpException('没有权限', HttpStatus.FORBIDDEN);
  }
  //管理员才能创建 更改
  if (!system) {
    throw new HttpException('没有权限', HttpStatus.FORBIDDEN);
  }
}
