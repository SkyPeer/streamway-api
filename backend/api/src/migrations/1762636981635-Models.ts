import { MigrationInterface, QueryRunner } from "typeorm";

export class Models1762636981635 implements MigrationInterface {
    name = 'Models1762636981635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tf_trainings" DROP CONSTRAINT "FK_08f21d34ef7c67d71e1adc34fe8"`);
        await queryRunner.query(`ALTER TABLE "tf_models" DROP CONSTRAINT "FK_a5c1991feb5cdb5d971899d55a5"`);
        await queryRunner.query(`ALTER TABLE "tf_trainings" DROP COLUMN "modelId"`);
        await queryRunner.query(`ALTER TABLE "tf_models" DROP COLUMN "trainId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tf_models" ADD "trainId" integer`);
        await queryRunner.query(`ALTER TABLE "tf_trainings" ADD "modelId" integer`);
        await queryRunner.query(`ALTER TABLE "tf_models" ADD CONSTRAINT "FK_a5c1991feb5cdb5d971899d55a5" FOREIGN KEY ("trainId") REFERENCES "tf_trainings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tf_trainings" ADD CONSTRAINT "FK_08f21d34ef7c67d71e1adc34fe8" FOREIGN KEY ("modelId") REFERENCES "tf_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
