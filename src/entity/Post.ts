import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Comment} from './Comment';
import {User} from './User';

interface Errors {
  title: string[],
  content: string[],
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column('varchar')
  title: string;
  @Column('text')
  content: string;
  @Column('int')
  authorId: number;
  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date;
  @UpdateDateColumn({type: 'timestamp'})
  updatedAt: Date;
  @ManyToOne(type => User, user => user.posts)
  author: User;
  @OneToMany(type => Comment, comment => comment.post)
  comments: Comment[];

  errors: Errors = {
    title: [],
    content: [],
  };
  async validate () {
    if (this.title === '') {
      this.errors.title.push('标题不能为空');
    }
    if (this.content === '') {
      this.errors.content.push('内容不能为空');
    }
  };
  hasError () {
    return !!Object.values(this.errors).find(v => v.length > 0);
  }
}
