import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Req() req) {
    return this.userService.create(req);
  }

  @Get('code')
  getCode(@Req() req, @Res() res) {
    const Captcha = this.userService.getCode();
    req.session.code = Captcha.text;
    res.type('image/svg+xml');
    res.send(Captcha.data);
  }
}
