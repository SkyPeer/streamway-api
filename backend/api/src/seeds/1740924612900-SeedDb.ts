import { MigrationInterface, QueryRunner } from 'typeorm';

const getValues = (dataSetCount, offset) => {
  const valuesSql = [];

  for (let idx = 0; idx < dataSetCount; idx++) {
    valuesSql.push(`(
        $${idx * offset + 1}, 
        $${idx * offset + 2}, 
        $${idx * offset + 3}, 
        $${idx * offset + 4}, 
        $${idx * offset + 5}, 
        $${idx * offset + 6}, 
        $${idx * offset + 7}, 
        $${idx * offset + 8})`);
  }
  return valuesSql;
};

function generateRandomDataset(days, tempRanges, startDate, locationIds) {
  const data = [];
  let recordDate = new Date(startDate);

  for (let i = 0; i < days; i++) {
    // const daysOffset = Math.floor(Math.random() * 30);
    // const locationId = locationIds[Math.floor(Math.random() * locationIds.length)];

    // City id1
    const temp1 =
      Math.random() * (tempRanges.maxTemp1 - tempRanges.minTemp1) +
      tempRanges.minTemp1;
    const temp2 = temp1 + Math.random() * (tempRanges.maxTemp2 - temp1);

    const dataObject = {
      min: parseFloat(temp1.toFixed(1)),
      max: parseFloat(Math.min(temp2, tempRanges.maxTemp2).toFixed(1)),
      timeStamp: recordDate,
      wind_speed: 10,
      wind_direction: 15,
      predict: 10,
      random: true,
      cityId: 1,
    };

    console.log('dataObject', dataObject);

    data.push(dataObject);

    // City id7
    // temp1 = Math.random() * (tempRanges.maxTemp1 - tempRanges.minTemp1) + tempRanges.minTemp1;
    // temp2 = temp1 + Math.random() * (tempRanges.maxTemp2 - temp1);
    //
    // data.push({
    //     min: parseFloat(temp1.toFixed(1)),
    //     max: parseFloat(Math.min(temp2, tempRanges.maxTemp2).toFixed(1)),
    //     created: recordDate,
    //     cityId: locationIds[1]
    // });

    const timestamp = new Date(recordDate);
    timestamp.setDate(timestamp.getDate() + 1);
    recordDate = timestamp;
  }
  return data;
}

const getDataSet = () => {
  const result = [];
  const dataSet = generateRandomDataset(
    20,
    { minTemp1: 10, maxTemp1: 20, minTemp2: 15, maxTemp2: 25 },
    '2024-08-01',
    [1, 7],
  );
  for (let idx = 0; idx < dataSet.length; idx++) {
    const item = dataSet[idx];
    const arr = [
      item.min,
      item.max,
      item.wind_speed,
      item.wind_direction,
      item.predict,
      item.timeStamp,
      item.random,
      item.cityId,
    ];
    result.push(...arr);
  }
  return result;
};

export class SeedDb1740924612922 implements MigrationInterface {
  name = 'SeedDb1740934612915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(getSql());

    await queryRunner.query(
      `INSERT INTO forecast_temperature (min, max, wind_speed, wind_direction, predict, "timeStamp", random, "cityId")
             VALUES ${getValues(20, 8)};`, // days * numberOfCities (20 days * 2 cities) || offset (number of columns)
      [...getDataSet()],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
