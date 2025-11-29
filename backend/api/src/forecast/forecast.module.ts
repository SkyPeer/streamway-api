import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ForecastService } from '@app/forecast/forecast.service';
import { ForecastController } from '@app/forecast/forecast.controller';
import { TrainingService } from '@app/forecast/forecast.training.service';
import { SaveModelService } from '@app/forecast/forecast.saveModel.service';
import { LoadModelService } from '@app/forecast/forecast.loadModel.service';
import { TFModel_Entity } from '@app/forecast/entities/tf_model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TFModel_Entity])],
  controllers: [ForecastController],
  providers: [
    ForecastService,
    TrainingService,
    SaveModelService,
    LoadModelService,
  ],
  exports: [
    ForecastService,
    TrainingService,
    SaveModelService,
    LoadModelService,
  ],
})
export class ForecastModule {}
