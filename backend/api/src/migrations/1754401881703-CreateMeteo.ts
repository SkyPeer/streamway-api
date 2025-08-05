import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMeteo1754401881703 implements MigrationInterface {
    name = 'CreateMeteo1754401881703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meteo" ("id" SERIAL NOT NULL, "min" integer NOT NULL, "max" integer NOT NULL, "city" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1805764714d10de3577ceecff8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "meteo"`);
    }

}
