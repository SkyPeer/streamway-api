const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

// // const modelJSON = await model.toJSON();
// const weightData = await model.getWeights();
// // Convert weights to Buffer
// const weightsBuffer = Buffer.concat(
//     weightData.map(tensor => Buffer.from(tensor.dataSync().buffer))
// );
//
// const path_ttt = path.join('./src/forecast/saved_model/', 'model.bin');
// console.log('path_ttt', path_ttt);
//
// await fs.writeFile(path_ttt, weightsBuffer, (err) => {
//     if (err) {
//         console.error('Error writing file:', err);
//         return;
//     }
//     console.log('File written successfully!');
// });

// console.log('modelJSON', modelJSON);

const pgPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'streamway',
  user: '',
  password: '',
});

async function saveModelToPostgreSQL(
  model: any,
  modelName = 'newModel',
  trainMonthsX: any,
  trainY: any,
) {
  try {
    console.log('\n=== SAVING MODEL TO POSTGRESQL ===');

    // Get model as JSON
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
    const query = `
            INSERT INTO tf_models (model_name, model_topology, weight_specs, weights, updated_at, description)
            VALUES ($1, $2, $3, $4, NOW(), $5)
            ON CONFLICT (model_name) 
            DO UPDATE SET
                model_topology = EXCLUDED.model_topology,
                weight_specs = EXCLUDED.weight_specs,
                weights = EXCLUDED.weights,
                updated_at = NOW(),
                description = EXCLUDED.description
        `;

    await pgPool.query(query, [
      modelName,
      modelTopology,
      JSON.stringify(weightSpecs),
      weightsBuffer,
      description,
    ]);

    console.log(`✓ Model saved to PostgreSQL: ${modelName}`);

    // Cleanup
    //        weightData.forEach(tensor => tensor.dispose());

    return true;
  } catch (error) {
    console.error('Error saving to PostgreSQL:', error);
    return false;
  }
}

export { saveModelToPostgreSQL };
