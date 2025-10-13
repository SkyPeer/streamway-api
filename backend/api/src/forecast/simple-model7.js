const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const path = require('path');

// Model with seasonal features
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
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
];

const trainY = [
    25.0, 25.5, 23.8, 21.2, 18.1, 15.3, 14.8, 16.2, 18.9, 21.4, 23.1, 24.6,
    26.1, 26.3, 24.2, 21.8, 18.5, 15.7, 14.2, 15.8, 19.3, 21.8, 23.7, 25.2,
    25.4, 25.8, 23.5, 20.9, 17.6, 14.9, 14.5, 16.0, 18.6, 21.1, 22.8, 24.3
];

function createFeatures(monthNumbers) {
    const features = [];
    for (let month of monthNumbers) {
        const monthInYear = ((month - 1) % 12) + 1;
        const angle = (2 * Math.PI * monthInYear) / 12;
        const sinSeason = Math.sin(angle);
        const cosSeason = Math.cos(angle);
        const trend = month / 36;
        features.push([sinSeason, cosSeason, trend]);
    }
    return features;
}

// ============================================
// SAVE MODEL TO DISK
// ============================================

async function saveModelToDisk(modelPath = './saved_model') {
    try {
        console.log(`\n=== SAVING MODEL ===`);

        // Save the model
        await model.save(`file://${modelPath}`);
        console.log(`✓ Model saved to: ${modelPath}`);

        // Save training data as JSON for reference
        const trainingData = {
            trainMonthsX,
            trainY,
            savedAt: new Date().toISOString(),
            modelInfo: {
                inputShape: [3],
                features: ['sinSeason', 'cosSeason', 'trend']
            }
        };

        await fs.writeFile(
            path.join(modelPath, 'training_data.json'),
            JSON.stringify(trainingData, null, 2)
        );
        console.log(`✓ Training data saved to: ${modelPath}/training_data.json`);

        return true;
    } catch (error) {
        console.error('Error saving model:', error);
        return false;
    }
}

// ============================================
// LOAD MODEL FROM DISK
// ============================================

async function loadModelFromDisk(modelPath = './saved_model') {
    try {
        console.log(`\n=== LOADING MODEL ===`);

        // Load the model
        model = await tf.loadLayersModel(`file://${modelPath}/model.json`);
        console.log(`✓ Model loaded from: ${modelPath}`);

        // Load training data (optional, for reference)
        const trainingDataPath = path.join(modelPath, 'training_data.json');
        const trainingDataJson = await fs.readFile(trainingDataPath, 'utf8');
        const trainingData = JSON.parse(trainingDataJson);
        console.log(`✓ Training data loaded, saved at: ${trainingData.savedAt}`);

        return { model, trainingData };
    } catch (error) {
        console.error('Error loading model:', error);
        return null;
    }
}

// ============================================
// CHECK IF MODEL EXISTS
// ============================================

async function modelExists(modelPath = './saved_model') {
    try {
        await fs.access(path.join(modelPath, 'model.json'));
        return true;
    } catch {
        return false;
    }
}

// ============================================
// TRAIN MODEL (only if needed)
// ============================================

async function trainSeasonalModel() {
    console.log('Creating model with seasonal features...');
    createModel();

    const trainFeatures = createFeatures(trainMonthsX);
    const xData = tf.tensor2d(trainFeatures);
    const yData = tf.tensor2d(trainY, [trainY.length, 1]);

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

    // Cleanup
    xData.dispose();
    yData.dispose();

    return model;
}

// ============================================
// PREDICT WITH MODEL (works with saved or trained model)
// ============================================

async function predictNextYear() {
    console.log('\n=== PREDICTIONS FOR NEXT YEAR (2025) ===');

    const nextYearMonths = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];
    const nextYearFeatures = createFeatures(nextYearMonths);
    const nextYearX = tf.tensor2d(nextYearFeatures);

    const nextYearPredictions = model.predict(nextYearX);
    const nextYearData = await nextYearPredictions.data();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const results = [];
    for (let i = 0; i < nextYearMonths.length; i++) {
        const temp = nextYearData[i];
        results.push({
            month: monthNames[i],
            temperature: temp
        });
        console.log(`${monthNames[i]} 2025: ${temp.toFixed(1)}°C`);
    }

    // Cleanup
    nextYearX.dispose();
    nextYearPredictions.dispose();

    return results;
}

// ============================================
// MAIN FUNCTION - Smart loading/training
// ============================================

async function main() {
    const modelPath = './saved_model';

    // Check if model already exists
    const exists = await modelExists(modelPath);

    if (exists) {
        console.log('✓ Found existing model, loading...');
        await loadModelFromDisk(modelPath);
        console.log('✓ Model loaded successfully! No training needed.');
    } else {
        console.log('✗ No saved model found, training new model...');
        await trainSeasonalModel();
        await saveModelToDisk(modelPath);
        console.log('✓ Model trained and saved!');
    }

    // Make predictions using the loaded/trained model
    await predictNextYear();
}

// ============================================
// ALTERNATIVE: Force retrain and save
// ============================================

async function forceRetrain() {
    console.log('=== FORCE RETRAINING ===');
    await trainSeasonalModel();
    await saveModelToDisk('./saved_model');
    console.log('✓ Model retrained and saved!');
}

// ============================================
// RUN
// ============================================

// Option 1: Smart load (uses saved model if exists, trains if not)
main().catch(console.error);

// Option 2: Force retrain
// forceRetrain().catch(console.error);

// Export functions for use in other files
module.exports = {
    trainSeasonalModel,
    saveModelToDisk,
    loadModelFromDisk,
    predictNextYear,
    modelExists,
    createFeatures
};