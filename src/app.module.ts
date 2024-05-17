import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import sqlConfig from './common/sqlConfig';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import jwtConfig from './common/jwtConfig';
import { User } from './user/entities/user.entity';
import { Task } from './task/entities/task.entity';
import { TaskModule } from './task/task.module';
import { SchoolModule } from './school/school.module';
import { AdminModule } from './admin/admin.module';
import Redis from 'ioredis';

@Module({
  imports: [
    TypeOrmModule.forRoot(sqlConfig),
    TypeOrmModule.forFeature([User, Task]),
    JwtModule.registerAsync({
      async useFactory() {
        return jwtConfig;
      },
    }),
    UserModule,
    FileModule,
    TaskModule,
    SchoolModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'REDIS', // redis
      useFactory: () => {
        const redis = new Redis({
          host: '127.0.0.1',
          port: 6379,
        });
        const redis2 = new Redis({
          host: '127.0.0.1',
          port: 6379,
        });
        const func = {
          set(type, ...args) {
            redis[type](...args);
          },
          get(type, ...args) {
            redis2[type](...args);
          },
        };
        return func;
      },
    },
  ],
})
export class AppModule {}
