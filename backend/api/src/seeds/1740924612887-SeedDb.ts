import { MigrationInterface, QueryRunner } from "typeorm";

const getValues = (dataSetCount, offset) => {
    const valuesSql = []

    for (let idx = 0; idx < dataSetCount; idx++ ) {
        valuesSql.push(`($${idx * offset + 1}, $${idx * offset + 2}, $${idx * offset + 3}, $${idx * offset + 4}, $${idx * offset + 5}, $${idx * offset + 6})`);

    }
    return valuesSql
}

const getDataSet = (dataSetCount) => {

    const result = [];

    const defaultArr = ['first-article1', 'first-article1', 'first-article1', 'first-article1', 'dragons1', 1]
    for (let idx = 0; idx < dataSetCount; idx++) {
        // const arr = [...defaultArr]
        // arr.push(idx)
        result.push(...defaultArr);
    }
    return result;
}


// Source
// await queryRunner.query(
//     `INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
//     VALUES ($1, $2, $3, $4, $5, 7);`,
//     [
//         'first-article1', 'first-article1', 'first-article1', 'first-article1', 'dragons1', 1,
//         /*'first-article2', 'first-article2', 'first-article2', 'first-article2', 'dragons2', 2*/
//     ]
// );

export class SeedDb1740924612912 implements MigrationInterface {
    name = 'SeedDb1740924612912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(getSql());

        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
             VALUES ${getValues(10000,6)};`,
            [...getDataSet(10000)]
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}