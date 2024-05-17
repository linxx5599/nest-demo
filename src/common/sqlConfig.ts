import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export default <TypeOrmModuleOptions>{
  type: 'mysql',
  username: 'root',
  password: '123456',
  host: '0.0.0.0',
  database: 'db',
  synchronize: true,
  retryDelay: 500,
  retryAttempts: 10,
  autoLoadEntities: true,
};
