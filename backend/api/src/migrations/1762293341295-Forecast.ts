import { MigrationInterface, QueryRunner } from "typeorm";

export class Forecast1762293341295 implements MigrationInterface {
    name = 'Forecast1762293341295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forecast_cities" ADD "code" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forecast_cities" DROP COLUMN "code"`);
    }

}
