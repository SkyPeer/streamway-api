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
import { ForecastService } from '@app/forecast/forecast.service';
import { LoadModelService } from '@app/forecast/forecast.loadModel.service';

@Controller('forecast')
export class ForecastController {
  constructor(
    private readonly forecastService: ForecastService,
    private readonly loadModelService: LoadModelService,
  ) {}

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

  @Get('/model')
  @Header('Cache-Control', 'no-store')
  // @UseGuards(AuthGuard)
  async model() {
    return this.loadModelService.getTrainings();
  }
}
