import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @Column({ comment: '账号|学号', name: 'student_id' })
  account: string;

  @Column({ comment: '名称' })
  name: string;

  @Column({ comment: '密码', select: false })
  password: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'school_id', comment: '学院id' })
  schoolId: string;

  @Column({ type: 'uuid', name: 'school_name', comment: '学院' })
  schoolName: string;

  // 0 1 男女
  @Column({ comment: '性别', default: 0 })
  sex: number;

  @Column({ type: 'boolean', default: 1, comment: '正常|限制' })
  enabled: boolean;

  @Column({ nullable: true, default: 0, comment: '钱' })
  money: number;

  @Column({ nullable: true, comment: '手机号' })
  phone: number;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time' })
  createTime: Date;
}
