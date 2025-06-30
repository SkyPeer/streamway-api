import { MigrationInterface, QueryRunner } from "typeorm";
// import { faker } from "@faker-js/faker";

const getValues = (dataSetCount, offset) => {
    const valuesSql = []

    for (let idx = 0; idx < dataSetCount; idx++ ) {
        valuesSql.push(`($${idx * offset + 1}, $${idx * offset + 2}, $${idx * offset + 3}, $${idx * offset + 4}, $${idx * offset + 5}, $${idx * offset + 6})`);

    }
    return valuesSql
}

// const getSql = () => {
//     return (`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ${getSqlValues(1,6)} ['first-article1', 'first-article1', 'first-article1', 'first-article1', 'dragons1', 1]`);
// }

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


// export class SeedDynamicArticles implements MigrationInterface {
//     public async up(queryRunner: QueryRunner): Promise<void> {
//         const numArticles = 5; // Generate 5 random articles
//         const articles = [];
//         const valuesSql: string[] = [];
//
//         for (let i = 0; i < numArticles; i++) {
//             const slug = faker.helpers.slugify(faker.lorem.words(3)).toLowerCase();
//             const title = faker.lorem.sentence(3);
//             const description = faker.lorem.sentence();
//             const body = faker.lorem.paragraphs(2);
//             const tagList = faker.helpers.arrayElement(['tech', 'science', 'health']);
//             const authorId = (i % 2) + 1; // alternate authorId between 1 and 2
//
//             // Push values to parameter array
//             articles.push(slug, title, description, body, tagList, authorId);
//
//             // Push value placeholders like: ($1, $2, $3, $4, $5, $6)
//             const offset = i * 6;
//             valuesSql.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`);
//         }
//
//         const sql = `
//       INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
//       VALUES ${valuesSql.join(", ")};
//     `;
//
//         await queryRunner.query(sql, articles);
//     }
//
//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`DELETE FROM articles;`);
//     }
// }

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



// console.log(`Updating seed db...`);
// console.log(`Updating seed db...`,  getSql());

// await queryRunner.query(
//     `INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
//     VALUES ($1, $2, $3, $4, $5, 7);`,
//     [
//         'first-article1', 'first-article1', 'first-article1', 'first-article1', 'dragons1', 1,
//         /*'first-article2', 'first-article2', 'first-article2', 'first-article2', 'dragons2', 2*/
//     ]
// );

// await queryRunner.query(
//     `INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
//      VALUES ('first-article', 'first-article', 'first-article', 'first-article', 'coffe,dragons', 1)`,
// );