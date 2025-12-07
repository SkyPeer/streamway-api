const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const path = require('path');
import {saveModelToPostgreSQL} from "@app/forecast/save_model";

const { Pool } = require('pg');

const pgPool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'streamway',
    user: '',
    password: ''
});

// Model with seasonal features (sine and cosine waves)
// This captures the cyclical pattern of seasons
let model;

function createModel() {
    model = tf.sequential({
        layers: [
            tf.layers.dense({ inputShape: [3], units: 8, activation: 'relu' }),
            tf.layers.dense({ units: 1 })
        ]
    });

    model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'meanSquaredError'
    });

    return model;
}


const trainMonthsX = [
    // 2022: months 1-12
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    // 2023: months 13-24
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    // 2024: months 25-36
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
];

const trainY = [
    // 2022 temperatures
    25.0, 25.5, 23.8, 21.2, 18.1, 15.3, 14.8, 16.2, 18.9, 21.4, 23.1, 24.6,
    // 2023 temperatures
    26.1, 26.3, 24.2, 21.8, 18.5, 15.7, 14.2, 15.8, 19.3, 21.8, 23.7, 25.2,
    // 2024 temperatures
    25.4, 25.8, 23.5, 20.9, 17.6, 14.9, 14.5, 16.0, 18.6, 21.1, 22.8, 24.3
];

// Helper function to create seasonal features
function createFeatures(monthNumbers) {
    console.log('\n=== createFeatures === START === ');
    const features = [];

    for (let month of monthNumbers) {
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

// async function saveModelToPostgreSQL(modelName = 'temperature_model') {
//     try {
//         console.log('\n=== SAVING MODEL TO POSTGRESQL ===');
//
//         // Get model as JSON
//         const modelJSON = await model.toJSON();
//         const modelTopology = JSON.stringify(modelJSON.modelTopology);
//
//         // Get weights as ArrayBuffer
//         const weightSpecs = modelJSON.weightSpecs;
//         const weightData = await model.getWeights();
//
//         // Convert weights to Buffer
//         const weightsBuffer = Buffer.concat(
//             weightData.map(tensor => Buffer.from(tensor.dataSync().buffer))
//         );
//
//         // Save to database
//         const query = `
//             INSERT INTO ml_models (model_name, model_topology, weight_specs, weights, created_at)
//             VALUES ($1, $2, $3, $4, NOW())
//             ON CONFLICT (model_name)
//             DO UPDATE SET
//                 model_topology = $2,
//                 weight_specs = $3,
//                 weights = $4,
//                 updated_at = NOW()
//         `;
//
//         await pgPool.query(query, [
//             modelName,
//             modelTopology,
//             JSON.stringify(weightSpecs),
//             weightsBuffer
//         ]);
//
//         console.log(`✓ Model saved to PostgreSQL: ${modelName}`);
//
//         // Cleanup
// //        weightData.forEach(tensor => tensor.dispose());
//
//         return true;
//     } catch (error) {
//         console.error('Error saving to PostgreSQL:', error);
//         return false;
//     }
// }

async function trainSeasonalModel() {
    console.log('Creating model with seasonal features...');
    createModel();

    // Create features with seasonal patterns
    const trainFeatures = createFeatures(trainMonthsX);
    const xData = tf.tensor2d(trainFeatures);
    const yData = tf.tensor2d(trainY, [trainY.length, 1]);

    // Train the model
    console.log('Training model...');
    await model.fit(xData, yData, {
        epochs: 200,
        batchSize: 12,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if (epoch % 50 === 0) {
                    console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
                }
            }
        }
    });

    console.log('\nTraining complete!');

    // Get predictions for training data
    const trainPredictions = model.predict(xData);
    const trainPredictionsData = await trainPredictions.data();

    const predictedPoints = [];
    for (let i = 0; i < trainMonthsX.length; i++) {
        predictedPoints.push({
            x: trainMonthsX[i],
            y: trainPredictionsData[i]
        });
    }

    // ============================================
    // PREDICT FOR NEXT YEAR (2025)
    // Months 37-48
    // ============================================

    console.log('\n=== PREDICTIONS FOR NEXT YEAR (2025) ===');

    const nextYearMonths = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
    const nextYearFeatures = createFeatures(nextYearMonths);
    const nextYearX = tf.tensor2d(nextYearFeatures);
    const nextYearPredictions = model.predict(nextYearX);
    const nextYearData = await nextYearPredictions.data();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const nextYearResults = [];
    for (let i = 0; i < nextYearMonths.length; i++) {
        const monthNum = nextYearMonths[i];
        const calendarMonth = ((monthNum - 1) % 12) + 1;
        const temp = nextYearData[i];
        nextYearResults.push({
            monthNumber: monthNum,
            calendarMonth: calendarMonth,
            monthName: monthNames[i],
            temperature: temp
        });
        console.log(`${monthNames[i]} 2025: ${temp.toFixed(1)}°C`);
    }

    // ============================================
    // VALIDATION: Compare predictions vs actual for 2024
    // ============================================
    console.log('\n=== VALIDATION: 2024 Actual vs Predicted ===');
    // TOTAL ERRORS
    // let totalError = 0;
    // for (let i = 24; i < 36; i++) {
    //     const actual = trainY[i];
    //     const predicted = trainPredictionsData[i];
    //     const monthName = monthNames[i - 24];
    //     const error = Math.abs(actual - predicted);
    //     totalError += error;
    //     console.log(`${monthName}: Actual ${actual.toFixed(1)}°C, Predicted ${predicted.toFixed(1)}°C, Error ${error.toFixed(1)}°C`);
    // }
    // const avgError = totalError / 12;
    // console.log(`Average prediction error: ${avgError.toFixed(2)}°C`);

    // Cleanup
    trainPredictions.dispose();
    nextYearX.dispose();
    nextYearPredictions.dispose();
    xData.dispose();
    yData.dispose();

    return {
        originalPoints: trainMonthsX.map((item, idx) => ({x: item, y: trainY[idx]})),
        originalPointsX: trainMonthsX,
        originalPointsY: trainY,

        predictedPoints,
        predictedPointsX: predictedPoints.map(item => item.x),
        predictedPointsY: predictedPoints.map(item => item.y),

        nextYearPredictions: nextYearResults.map(item =>({x: item.monthNumber, y: item.temperature})),
        nextYearX: nextYearResults.map(item => item.monthNumber),
        nextYearY: nextYearResults.map(item => item.temperature)
    };
}

// Run and display results
// trainSeasonalModel().then(result => {
//     console.log('\n=== Result === ');
//     console.log(result);
//
//     return result

    // console.log('\n=== NEXT YEAR FORECAST (2025) ===');
    // result.nextYearPredictions.forEach(pred => {
    //     console.log(`${pred.monthName}: ${pred.temperature.toFixed(1)}°C`);
    // });
    //
    // const avgTemp = result.nextYearY.reduce((a, b) => a + b, 0) / result.nextYearY.length;
    // console.log(`\nAverage predicted temperature for 2025: ${avgTemp.toFixed(1)}°C`);
    //
    // // Compare with 2024 average
    // const avg2024 = result.originalPointsY.slice(24, 36).reduce((a, b) => a + b, 0) / 12;
    // console.log(`Average temperature in 2024: ${avg2024.toFixed(1)}°C`);
    // console.log(`Temperature change: ${(avgTemp - avg2024).toFixed(1)}°C`);
// }).catch(console.error);

export {trainSeasonalModel}