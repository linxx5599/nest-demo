import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid', { name: 'task_id' })
  taskId: string;

  @Column({ comment: '任务名称', name: 'task_name' })
  taskName: string;

  @Column({ comment: '任务状态', default: () => 0 })
  // 0 1 2 3
  status: number;

  @Column({ comment: '发布用户id', name: 'publlish_user_id' })
  publlishUserId: string;

  @Column({ comment: '发布用户昵称', name: 'publlish_user_name' })
  publlishUserName: string;

  @Column({ comment: '任务内容', nullable: true, type: 'text' })
  content: string;

  @Column({
    comment: '已接受任务用户id',
    name: 'accpet_user_id',
    nullable: true,
  })
  accpetUserId: string;

  @Column({
    comment: '已接受任务用户昵称',
    name: 'accpet_user_name',
    nullable: true,
  })
  accpetUserName: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_time' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_time' })
  updateTime: Date;
}
