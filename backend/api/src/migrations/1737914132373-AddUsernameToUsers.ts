import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameToUsers1737914132373 implements MigrationInterface {
    name = 'AddUsernameToUsers1737914132373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
