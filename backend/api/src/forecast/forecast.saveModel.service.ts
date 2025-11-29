import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, DataSource } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { TFModel_Entity } from '@app/forecast/entities/tf_model.entity';
import { ArticleEntity } from '@app/article/article.entity';
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const pgPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'streamway',
  user: '',
  password: '',
});

@Injectable()
export class SaveModelService {
  constructor(
    @InjectRepository(TFModel_Entity)
    private readonly modelRepository: Repository<TFModel_Entity>,
  ) {}

  async saveModelToPostgreSQL(model: any, modelName = 'newModel') {
    try {
      console.log('\n=== SAVING MODEL TO POSTGRESQL ===');

      // Get mode l as JSON
      const modelJSON = await model.toJSON();
      const modelTopology = JSON.stringify(modelJSON);

      // console.log('modelJSON', modelJSON);

      // Get weights as ArrayBuffer
      // const weightSpecs = modelJSON.weightSpecs;

      const weightData = await model.getWeights();

      const description: string = 'description_model_test';

      const weightSpecs = weightData.map((tensor, index) => {
        return {
          // name: `weight_${index}`,  // You choose the name
          //name: tensor.name,
          //shape: tensor.shape,       // From the tensor
          //dtype: tensor.dtype        // From the tensor
          ...tensor,
        };
      });

      // Convert weights to Buffer
      const weightsBuffer = Buffer.concat(
        weightData.map((tensor) => Buffer.from(tensor.dataSync().buffer)),
      );

      const cityId: number = 1;

      // Save to database
      // const query = `
      //       INSERT INTO tf_models (model_name, model_topology, weight_specs, weights, updated_at, description)
      //       VALUES ($1, $2, $3, $4, NOW(), $5)
      //       ON CONFLICT (model_name)
      //       DO UPDATE SET
      //           model_topology = EXCLUDED.model_topology,
      //           weight_specs = EXCLUDED.weight_specs,
      //           weights = EXCLUDED.weights,
      //           updated_at = NOW(),
      //           description = EXCLUDED.description
      //   `;

      // await pgPool.query(query, [
      //   modelName,
      //   modelTopology,
      //   JSON.stringify(weightSpecs),
      //   weightsBuffer,
      //   description,
      // ]);

      const saveModel = new TFModel_Entity();

      // const savedModel: TFModel_Entity = {
      //   model_name: modelName,
      //   model_topology: modelTopology,
      //   weight_specs: JSON.stringify(weightSpecs),
      //   weights: weightsBuffer,
      //   description
      // };

      saveModel.model_name = modelName;
      saveModel.model_topology = modelTopology;
      saveModel.weight_specs = JSON.stringify(weightSpecs);
      saveModel.weights = weightsBuffer;
      saveModel.description = description;

      await this.modelRepository.save(saveModel);

      console.log(`✓ Model saved to PostgreSQL: ${modelName}`);

      // Cleanup
      //        weightData.forEach(tensor => tensor.dispose());

      return true;
    } catch (error) {
      console.error('Error saving to PostgreSQL:', error);
      return false;
    }
  }
}
