import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@app/user/user.module';
import {AuthMiddleware} from "@app/middlewares/auth.middleware";
import {ArticleModule} from "@app/article/article.module";
import ormconfig from '@app/ormconfig';
import {ProfileModule} from "@app/profile/profile.module";

// Examples api's requests
// https://realworld-docs.netlify.app/

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    TagModule,
    ArticleModule,
    ProfileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
