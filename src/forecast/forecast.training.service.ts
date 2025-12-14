import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleEntity } from '@app/article/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, DataSource } from 'typeorm';

@Injectable()
export class TrainingService {
  constructor() {}

  get data() {
    return [1, 2, 3];
  }

  get data2() {
    return [1, 2, 3];
  }
}
