// Your exact pattern - using tf.variable for learnable parameters
const tf = require('@tensorflow/tfjs-node');

// @ts-ignore
const m = tf.variable(tf.scalar(Math.random()));
// @ts-ignore
const b = tf.variable(tf.scalar(Math.random()));

function predict(x) {
    return tf.tidy(() => {
        return m.mul(x).add(b);
    });
}

const trainX = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
];
const trainY = [
    25.0, 25.5, 23.8, 21.2, 18.1, 15.3, 14.8, 16.2, 18.9, 21.4, 23.1, 24.6,

    // 2023 temperatures
    26.1, 26.3, 24.2, 21.8, 18.5, 15.7, 14.2, 15.8, 19.3, 21.8, 23.7, 25.2,

    // 2024 temperatures
    25.4, 25.8, 23.5, 20.9, 17.6, 14.9, 14.5, 16.0, 18.6, 21.1, 22.8, 24.3

];

// Complete training example
async function trainLinearRegression() {
    // Training data: y = 2x + 1
    const xData = tf.tensor2d(trainX, [trainX.length, 1]);
    const yData = tf.tensor2d(trainY, [trainY.length, 1]);

    // Loss function
    function loss() {
        return tf.tidy(() => {
            const predictions = predict(xData);
            console.log('predictions', predictions);
            return tf.losses.meanSquaredError(yData, predictions);
        });
    }

    // Optimizer
    const optimizer = tf.train.sgd(0.005);

    // Training loop
    for (let i = 0; i < 10; i++) {
        // @ts-ignore
        optimizer.minimize(() => loss());

        if (i % 100 === 0) {
      //      console.log(`Step ${i}: loss = ${loss().dataSync()[0]}`);
        }
    }

    // Get predictions for training data
    const testResult = predict(tf.tensor2d([trainX]));
    const testResultData = await testResult.data()

    const predictedPoints = [];
    for (let i = 0; i < testResultData.length; i++) {
        predictedPoints.push({ x: trainX[i], y: testResultData[i] });
    }

    // Cleanup
    // testResult.dispose();
    // xData.dispose();
    // yData.dispose();

    return {
        // xs: originalPoints.map(item => item.x),
        // ys: originalPoints.map(item => item.y),
        originalPoints: trainX.map((item, idx) => ({x: item, y: trainY[idx]})),
        originalPointsX: trainX,
        originalPointsY: trainY,

        predictedPoints,
        predictedPointsX: predictedPoints.map(item => item.x),
        predictedPointsY: predictedPoints.map(item => item.y),
    };

}

export {trainLinearRegression}

// trainLinearRegression();