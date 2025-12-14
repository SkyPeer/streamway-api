import { MigrationInterface, QueryRunner } from "typeorm";

export class MeteoServiceMigration1755381119905 implements MigrationInterface {
    name = 'MeteoServiceMigration1755381119905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meteo_temps" ("id" SERIAL NOT NULL, "min" numeric(10,7) NOT NULL, "max" numeric(10,7) NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "cityId" integer, CONSTRAINT "PK_5792d5583432a143a38d41db54d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "meteo_temps" ADD CONSTRAINT "FK_189ab1e90c30180bcd478d918a0" FOREIGN KEY ("cityId") REFERENCES "meteo_cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meteo_temps" DROP CONSTRAINT "FK_189ab1e90c30180bcd478d918a0"`);
        await queryRunner.query(`DROP TABLE "meteo_temps"`);
    }

}
