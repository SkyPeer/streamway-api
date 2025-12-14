import { MigrationInterface, QueryRunner } from "typeorm";

export class Models1762187846166 implements MigrationInterface {
    name = 'Models1762187846166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tf_models" DROP CONSTRAINT "FK_b96b12142af0273d1a6b270cc29"`);
        await queryRunner.query(`ALTER TABLE "tf_models" DROP CONSTRAINT "UQ_b96b12142af0273d1a6b270cc29"`);
        await queryRunner.query(`ALTER TABLE "tf_models" DROP COLUMN "cityId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tf_models" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "tf_models" ADD CONSTRAINT "UQ_b96b12142af0273d1a6b270cc29" UNIQUE ("cityId")`);
        await queryRunner.query(`ALTER TABLE "tf_models" ADD CONSTRAINT "FK_b96b12142af0273d1a6b270cc29" FOREIGN KEY ("cityId") REFERENCES "forecast_cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
