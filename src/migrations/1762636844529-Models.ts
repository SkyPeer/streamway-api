import { MigrationInterface, QueryRunner } from "typeorm";

export class Models1762636844529 implements MigrationInterface {
    name = 'Models1762636844529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tf_trainings" ("id" SERIAL NOT NULL, "epoch" numeric(10,7) NOT NULL, "loss" numeric(10,7) NOT NULL, "modelId" integer, CONSTRAINT "PK_d8a767cb3883a9726f4bbc5da76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tf_models" ADD "trainId" integer`);
        await queryRunner.query(`ALTER TABLE "tf_models" ADD CONSTRAINT "FK_a5c1991feb5cdb5d971899d55a5" FOREIGN KEY ("trainId") REFERENCES "tf_trainings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tf_trainings" ADD CONSTRAINT "FK_08f21d34ef7c67d71e1adc34fe8" FOREIGN KEY ("modelId") REFERENCES "tf_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tf_trainings" DROP CONSTRAINT "FK_08f21d34ef7c67d71e1adc34fe8"`);
        await queryRunner.query(`ALTER TABLE "tf_models" DROP CONSTRAINT "FK_a5c1991feb5cdb5d971899d55a5"`);
        await queryRunner.query(`ALTER TABLE "tf_models" DROP COLUMN "trainId"`);
        await queryRunner.query(`DROP TABLE "tf_trainings"`);
    }

}
