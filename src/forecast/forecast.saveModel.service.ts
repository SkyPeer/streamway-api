import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TFModel_Entity } from '@app/forecast/entities/tf_model.entity';

@Injectable()
export class SaveModelService {
  constructor(
    @InjectRepository(TFModel_Entity)
    private readonly modelRepository: Repository<TFModel_Entity>,
  ) {}

  async saveModelToPostgreSQL(
    model: any,
    modelName = 'newModel',
    cityId: number,
  ) {
    try {
      console.log('\n=== SAVING MODEL TO POSTGRESQL ===');

      // Get mode l as JSON
      const modelJSON = await model.toJSON();
      const modelTopology = JSON.stringify(modelJSON);

      // Get weights as ArrayBuffer
      const weightData = await model.getWeights();
      const description: string = 'description_model_test';
      const weightSpecs = weightData.map((tensor) => ({ ...tensor }));

      // Convert weights to Buffer
      const weightsBuffer = Buffer.concat(
        weightData.map((tensor) => Buffer.from(tensor.dataSync().buffer)),
      );

      const cityId: number = 1;

      const saveModel = new TFModel_Entity();

      saveModel.model_name = modelName;
      saveModel.model_topology = modelTopology;
      saveModel.weight_specs = JSON.stringify(weightSpecs);
      saveModel.weights = weightsBuffer;
      saveModel.description = description;

      const savedModel = await this.modelRepository.save(saveModel);

      console.log(
        `✓ Model saved to PostgreSQL: ${modelName}`,
        'result',
        savedModel,
      );

      // TODO: Cleanup
      // weightData.forEach(tensor => tensor.dispose());

      return savedModel;
    } catch (err) {
      console.error('Error saving to PostgreSQL:', err);
      throw err;
    }
  }
}
