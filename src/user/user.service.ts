import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
@Injectable()
export class UserService {
  create(req) {
    const { code } = req.body;
    if (req?.session?.code.toLocaleLowerCase() === code.toLocaleLowerCase()) {
      return '200';
    }
    return 'This action adds a new user';
  }

  getCode() {
    return svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
  }
}
