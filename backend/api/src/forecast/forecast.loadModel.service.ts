import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TFModel_Entity } from '@app/forecast/entities/tf_model.entity';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class LoadModelService {
  constructor(
    @InjectRepository(TFModel_Entity)
    private readonly modelRepository: Repository<TFModel_Entity>,
  ) {}

  async loadModelFromPostgreSQL(modelName = 'newModel') {
    try {
      console.log('\n=== LOADING MODEL FROM POSTGRESQL ===');

      const result = await this.modelRepository.findOne({
        where: { model_name: 'newModel' },
      });

      if (!result) {
        console.log('ERROR MODEL FROM POSTGRESQL');
        //throw new Error('Model not found in database');
      }

      const { model_topology, weight_specs, weights } = result;

      // Parse model topology
      const modelTopology = JSON.parse(JSON.parse(model_topology));
      const weightSpecs = JSON.parse(weight_specs);

      const model = await tf.models.modelFromJSON(modelTopology);

      // Now load weights separately
      const weightData = new Uint8Array(weights);
      const weightTensors = [];
      let offset = 0;

      for (const spec of weightSpecs) {
        const size = spec.shape.reduce((a, b) => a * b, 1);
        const bytes = size * 4; // 4 bytes per float32
        const tensorData = weightData.slice(offset, offset + bytes);
        const tensor = tf.tensor(
          new Float32Array(tensorData.buffer),
          spec.shape,
        );
        weightTensors.push(tensor);
        offset += bytes;
      }

      // console.log('weightTensors', weightTensors);

      // Set the loaded weights to the model
      model.setWeights(weightTensors);
      console.log(`✓ Model loaded from PostgreSQL: ${modelName}`);

      // Cleanup
      // weightTensors.forEach(tensor => tensor.dispose());

      return model;
    } catch (err) {
      console.error('Error loading from PostgreSQL:', err);
      return null;
    }
  }
}
