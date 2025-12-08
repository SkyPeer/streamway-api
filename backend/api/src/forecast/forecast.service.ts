import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, DataSource } from 'typeorm';
import * as tf from '@tensorflow/tfjs-node';
//import { TrainingService } from '@app/forecast/forecast.training.service';
import { SaveModelService } from '@app/forecast/forecast.saveModel.service';
import { LoadModelService } from '@app/forecast/forecast.loadModel.service';
import { TF_trainingEntity } from '@app/forecast/entities/tf_training.entity';
import { TFModel_Entity } from '@app/forecast/entities/tf_model.entity';
import { AverageTemperatureEntity } from '@app/forecast/entities/average_temperature.entity';

// SAMPLE DATA
const trainMonthsX = [
  // 2022: months 1-12
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  // 2023: months 13-24
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  // 2024: months 25-36
  25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
];

const trainY = [
  // 2022 temperatures
  25.0, 25.5, 23.8, 21.2, 18.1, 15.3, 14.8, 16.2, 18.9, 21.4, 23.1, 24.6,
  // 2023 temperatures
  26.1, 26.3, 24.2, 21.8, 18.5, 15.7, 14.2, 15.8, 19.3, 21.8, 23.7, 25.2,
  // 2024 temperatures
  25.4, 25.8, 23.5, 20.9, 17.6, 14.9, 14.5, 16.0, 18.6, 21.1, 22.8, 24.3,
];

// CreateModel
function createModel() {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 1 }),
    ],
  });
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError',
  });
  return model;
}

// Helper function to create seasonal features
function createFeatures(monthNumbers) {
  console.log('\n=== createFeatures === START === ');
  const features = [];

  for (const month of monthNumbers) {
    // Get the month within year (1-12)
    const monthInYear = ((month - 1) % 12) + 1;

    // Create seasonal features using sine and cosine
    // This captures the cyclical nature of seasons
    const angle = (2 * Math.PI * monthInYear) / 12;
    const sinSeason = Math.sin(angle);
    const cosSeason = Math.cos(angle);

    // Also include a trend component (normalized month number)
    const trend = month / 36; // Normalize to 0-1 range

    features.push([sinSeason, cosSeason, trend]);
  }

  return features;
}

@Injectable()
export class ForecastService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(AverageTemperatureEntity)
    private readonly averageTemperatureRepository: Repository<AverageTemperatureEntity>,
    @InjectRepository(TF_trainingEntity)
    private readonly trainingRepository: Repository<TF_trainingEntity>,
    private readonly saveModel: SaveModelService,
    private readonly loadModel: LoadModelService,
  ) {}

  //TODO: GetData FromDataBase
  get seasonsData() {
    return {
      trainMonthsX,
      trainY,
      // newData: this.trainingService.data,
    };
  }

  // TODO: Maybe Private?
  async trainModel() {
    try {
      console.log('Creating model with seasonal features...');
      const model = createModel();

      const trainingLog: any[] = [];

      // Create features with seasonal patterns
      const trainFeatures = createFeatures(trainMonthsX);
      const xData = tf.tensor2d(trainFeatures);
      const yData = tf.tensor2d(trainY, [trainY.length, 1]);

      // Train the model
      console.log('Training model...');
      await model.fit(xData, yData, {
        epochs: 200, // 200  //TODO: config!
        batchSize: 12, // 12 //TODO: config!
        callbacks: {
          onEpochEnd: (epoch: number, logs: any) => {
            console.log('epoch:', epoch, ' - Log:', logs.loss);
            trainingLog.push({ epoch, loss: logs.loss });
            if (epoch % 50 === 0) {
              //console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
            }
          },
        },
      });

      //await saveModelToPostgreSQL(model, 'newModel', trainMonthsX, trainY);

      // ============================================
      // Save TrainedModel
      // ============================================
      const savedModel: TFModel_Entity =
        await this.saveModel.saveModelToPostgreSQL(model, 'newModel');

      // ============================================
      // Save TrainingLog
      // ============================================
      const data: TF_trainingEntity[] = trainingLog.map((item) => ({
        ...item,
        model: savedModel,
      }));
      await this.trainingRepository.insert(data);

      // ============================================
      // Get predictions for training data
      // ============================================
      const trainPredictions: any = model.predict(xData);
      const trainPredictionsData = await trainPredictions.data();

      const predictedPoints = [];
      for (let i = 0; i < trainMonthsX.length; i++) {
        predictedPoints.push({
          x: trainMonthsX[i],
          y: trainPredictionsData[i],
        });
      }

      const months: number[] = predictedPoints.map((item) => item.x);
      // const predicts: number[] = predictedPoints.map((item) => item.y);
      const predicts: any = predictedPoints
        .map((item) => `WHEN month = ${item.x} THEN ${item.y}`)
        .join(' ');


      console.log('Months', months);

      await this.averageTemperatureRepository
        .createQueryBuilder('averageTemperature')
        .update(AverageTemperatureEntity)
        .set({ predict: () => `CASE ${predicts} END` })
        .where('month IN (:...months)', { months })
        .execute();

      console.log(predictedPoints);

      return model;
    } catch (err) {
      console.error('Error training Model', err);
      throw err;
    }
  }

  private async predictData(model) {
    // ============================================
    // PREDICT FOR NEXT YEAR (2025)
    // Months 37-48
    // ============================================

    console.log('\n=== PREDICTIONS FOR NEXT YEAR (2025) from Save Model ===');

    const nextYearMonths = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
    const nextYearFeatures = createFeatures(nextYearMonths);
    const nextYearX = tf.tensor2d(nextYearFeatures);
    const nextYearPredictions = model.predict(nextYearX);
    const nextYearData = await nextYearPredictions.data();

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const nextYearResults = [];
    for (let i = 0; i < nextYearMonths.length; i++) {
      const monthNum = nextYearMonths[i];
      const calendarMonth = ((monthNum - 1) % 12) + 1;
      const temp = nextYearData[i];
      nextYearResults.push({
        monthNumber: monthNum,
        calendarMonth: calendarMonth,
        monthName: monthNames[i],
        temperature: temp,
      });
      console.log(`${monthNames[i]} 2025: ${temp.toFixed(1)}°C`);
    }

    // ============================================
    // VALIDATION: Compare predictions vs actual for 2024
    // ============================================
    console.log('\n=== VALIDATION: 2024 Actual vs Predicted ===');

    // Cleanup
    // trainPredictions.dispose();
    nextYearX.dispose();
    nextYearPredictions.dispose();
    // xData.dispose();
    // yData.dispose();

    return {
      originalPoints: trainMonthsX.map((item, idx) => ({
        x: item,
        y: trainY[idx],
      })),
      originalPointsX: trainMonthsX,
      originalPointsY: trainY,

      // predictedPoints,
      // predictedPointsX: predictedPoints.map(item => item.x),
      // predictedPointsY: predictedPoints.map(item => item.y),

      nextYearPredictions: nextYearResults.map((item) => ({
        x: item.monthNumber,
        y: item.temperature,
      })),
      nextYearX: nextYearResults.map((item) => item.monthNumber),
      nextYearY: nextYearResults.map((item) => item.temperature),
    };
  }

  async predict() {
    // const _model = await loadModelFromPostgreSQL('newModel');
    const model = await this.loadModel.loadModelFromPostgreSQL('newModel');
    if (!model) {
      // TODO: Create model
      const trainedModel = await this.trainModel();
      return await this.predictData(trainedModel);
    }

    //model = _model;
    return await this.predictData(model);

    //return await trainSeasonalModel()
  }
}
