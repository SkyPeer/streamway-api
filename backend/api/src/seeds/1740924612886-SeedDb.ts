import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1740924612886 implements MigrationInterface {
    name = 'SeedDb1740924612886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES ('dragons'), ('coffe'), ('nsetjs')`,
            );

        // test-user
        // email: admin@localhost.local
        // password: 123
        await queryRunner.query(
            `INSERT INTO users (username, email, password) VALUES ('admin', 'admin@localhost.local', '$2b$10$l4gEJU2.rApUAaWfUgwBtejRYZD1vhrXWFu0vq.E6sEFbdVN41B1G')`,
        );

        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId")
             VALUES ('first-article', 'first-article', 'first-article', 'first-article', 'coffe,dragons', 1)`,
        );

        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") 
             VALUES ('second-article', 'second-article', 'second-article', 'second-article', 'coffe,dragons', 1)`,
        );
    }



    public async down(queryRunner: QueryRunner): Promise<void> {}

}
