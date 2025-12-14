import { MigrationInterface, QueryRunner } from "typeorm";

export class Models1762178059476 implements MigrationInterface {
    name = 'Models1762178059476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forecast_temperature" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "forecast_temperature" ADD CONSTRAINT "FK_cacad057146ea72b6c1ea581de6" FOREIGN KEY ("cityId") REFERENCES "forecast_cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forecast_temperature" DROP CONSTRAINT "FK_cacad057146ea72b6c1ea581de6"`);
        await queryRunner.query(`ALTER TABLE "forecast_temperature" DROP COLUMN "cityId"`);
    }

}
