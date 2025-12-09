import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { ArticleEntity } from '@app/article/article.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import { ArticlesResponseInterface } from '@app/article/types/articlesResponse.interface';
import { main } from '@app/forecast/forecast_tf_months';
import { ForecastService } from '@app/forecast/forecast.service';

@Controller('forecast')
export class ForecastController {
  constructor(private readonly forecastService: ForecastService) {}

  @Get('/test')
  @Header('Cache-Control', 'no-store')
  async getTestItems() {
    return await main();
  }

  @Get('/data')
  @Header('Cache-Control', 'no-store')
  // @UseGuards(AuthGuard)
  async getInitialData() {
    return await this.forecastService.getSeasonsData();
  }

  @Get('/train')
  @Header('Cache-Control', 'no-store')
  // @UseGuards(AuthGuard)
  async training() {
    return this.forecastService.trainModel();
  }

  @Get('/predict')
  @Header('Cache-Control', 'no-store')
  // @UseGuards(AuthGuard)
  async predict() {
    return this.forecastService.predict();
  }
}
