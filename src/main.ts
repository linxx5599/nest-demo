import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';

import { befoerEachRoute } from './common/befoerEachRoute';
import { HttpResponse, HttpFilter } from './common/response';

import { join } from 'path';
import { FILE_STATIC } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(befoerEachRoute);
  app.useStaticAssets(join(__dirname, FILE_STATIC), {
    prefix: `/${FILE_STATIC}`,
  });
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalInterceptors(new HttpResponse());
  app.use(
    session({
      secret: 'linjy_text',
      name: 'linjy_text',
      rolling: true,
      cookie: { maxAge: null },
    }),
  );
  await app.listen(3000);
}
bootstrap();
