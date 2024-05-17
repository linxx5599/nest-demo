import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Admin {
  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '账号' })
  account: string;

  @Column({ comment: '密码', select: false })
  password: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time' })
  createTime: Date;
}
