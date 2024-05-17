import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

import { befoerEachRoute } from './common/befoerEachRoute';
import { HttpResponse, HttpFilter } from './common/response';

import { join } from 'path';
import { FILE_STATIC } from './common/config';
import { AuthGuard } from './common/authGuard';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(befoerEachRoute);
  app.useStaticAssets(join(__dirname, FILE_STATIC), {
    prefix: `/${FILE_STATIC}`,
  });
  const redis2 = new Redis({
    host: '127.0.0.1',
    port: 6379,
  });
  app.useGlobalGuards(new AuthGuard(redis2));
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalInterceptors(new HttpResponse());
  await app.listen(3000);
}
bootstrap();
