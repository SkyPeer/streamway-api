const tf = require('@tensorflow/tfjs-node');

const { Pool } = require('pg');

const pgPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'streamway',
  user: '',
  password: '',
});

async function loadModelFromPostgreSQL(modelName = 'newModel') {
  try {
    console.log('\n=== LOADING MODEL FROM POSTGRESQL ===');

    const query =
      'SELECT model_topology, weight_specs, weights FROM tf_models WHERE model_name = $1';
    const result = await pgPool.query(query, [modelName]);

    if (result.rows.length === 0) {
      throw new Error('Model not found in database');
    }

    const { model_topology, weight_specs, weights } = result.rows[0];

    // Parse model topology
    const modelTopology = JSON.parse(JSON.parse(model_topology));
    const weightSpecs = JSON.parse(weight_specs);

    const model = await tf.models.modelFromJSON(modelTopology);

    console.log('modelTopology', modelTopology);
    console.log(' ');
    console.log(' ');
    console.log(' ');
    console.log(' ');
    console.log('weightSpecs', weightSpecs);
    console.log('weights', weights);

    // Now load weights separately
    const weightData = new Uint8Array(weights);
    const weightTensors = [];
    let offset = 0;

    for (const spec of weightSpecs) {
      const size = spec.shape.reduce((a, b) => a * b, 1);
      const bytes = size * 4; // 4 bytes per float32
      const tensorData = weightData.slice(offset, offset + bytes);
      const tensor = tf.tensor(new Float32Array(tensorData.buffer), spec.shape);
      weightTensors.push(tensor);
      offset += bytes;
    }

    console.log('weightTensors', weightTensors);

    // Set the loaded weights to the model
    model.setWeights(weightTensors);

    // Create model from topology
    // const model = await tf.models.modelFromJSON({
    //     modelTopology,
    //     weightsManifest: [{
    //         paths: weights,
    //         weights: weightSpecs
    //     }]
    // });

    // console.log(' model ', model);

    // Load weights
    // const weightData = new Uint8Array(weights);
    // const weightTensors = [];
    // let offset = 0;

    // for (const spec of weightSpecs) {
    //     const size = spec.shape.reduce((a, b) => a * b, 1);
    //     const bytes = size * 4; // 4 bytes per float32
    //     const tensorData = weightData.slice(offset, offset + bytes);
    //     const tensor = tf.tensor(new Float32Array(tensorData.buffer), spec.shape);
    //     weightTensors.push(tensor);
    //     offset += bytes;
    // }

    // model.setWeights(weightTensors);

    console.log(`✓ Model loaded from PostgreSQL: ${modelName}`);

    // Cleanup
    // weightTensors.forEach(tensor => tensor.dispose());

    return model;
  } catch (error) {
    console.error('Error loading from PostgreSQL:', error);
    return null;
  }
}

export { loadModelFromPostgreSQL };
