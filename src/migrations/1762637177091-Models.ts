import { MigrationInterface, QueryRunner } from "typeorm";

export class Models1762637177091 implements MigrationInterface {
    name = 'Models1762637177091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tf_trainings" ADD "modelId" integer`);
        await queryRunner.query(`ALTER TABLE "tf_trainings" ADD CONSTRAINT "FK_08f21d34ef7c67d71e1adc34fe8" FOREIGN KEY ("modelId") REFERENCES "tf_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tf_trainings" DROP CONSTRAINT "FK_08f21d34ef7c67d71e1adc34fe8"`);
        await queryRunner.query(`ALTER TABLE "tf_trainings" DROP COLUMN "modelId"`);
    }

}
