import { MigrationInterface, QueryRunner } from "typeorm";

export class Forecast1765572087949 implements MigrationInterface {
    name = 'Forecast1765572087949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "average_temperature" ALTER COLUMN "predict" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "average_temperature" ALTER COLUMN "predict" DROP NOT NULL`);
    }

}
