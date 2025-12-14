import { MigrationInterface, QueryRunner } from "typeorm";

export class Models1762186861075 implements MigrationInterface {
    name = 'Models1762186861075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tf_models" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "forecast_cities" ADD "tfModelId" integer`);
        await queryRunner.query(`ALTER TABLE "forecast_cities" ADD CONSTRAINT "UQ_ab4fbb78e2b697e7351de1610c9" UNIQUE ("tfModelId")`);
        await queryRunner.query(`ALTER TABLE "forecast_cities" ADD CONSTRAINT "FK_ab4fbb78e2b697e7351de1610c9" FOREIGN KEY ("tfModelId") REFERENCES "tf_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forecast_cities" DROP CONSTRAINT "FK_ab4fbb78e2b697e7351de1610c9"`);
        await queryRunner.query(`ALTER TABLE "forecast_cities" DROP CONSTRAINT "UQ_ab4fbb78e2b697e7351de1610c9"`);
        await queryRunner.query(`ALTER TABLE "forecast_cities" DROP COLUMN "tfModelId"`);
        await queryRunner.query(`ALTER TABLE "tf_models" ADD "cityId" integer NOT NULL`);
    }

}
