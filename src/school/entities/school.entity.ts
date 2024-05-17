import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class School {
  @Column({ comment: '名称' })
  name: string;

  @PrimaryColumn({ comment: '学院id' })
  id: string;

  @Column({ type: 'boolean', default: 1, comment: '正常|限制' })
  enabled: boolean;

  @Column({
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: string;
}
