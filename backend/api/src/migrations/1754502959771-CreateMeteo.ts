import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMeteo1754502959771 implements MigrationInterface {
    name = 'CreateMeteo1754502959771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meteo_temps" ("id" SERIAL NOT NULL, "min" integer, "max" integer, "created" TIMESTAMP NOT NULL DEFAULT now(), "cityId" integer, CONSTRAINT "PK_5792d5583432a143a38d41db54d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meteo_cities" ("id" SERIAL NOT NULL, "lat" integer, "lon" integer, "city" character varying NOT NULL DEFAULT '', "country" character varying NOT NULL DEFAULT '', "description" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_cb60993243123d06de8abd0815b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "meteo_temps" ADD CONSTRAINT "FK_189ab1e90c30180bcd478d918a0" FOREIGN KEY ("cityId") REFERENCES "meteo_cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meteo_temps" DROP CONSTRAINT "FK_189ab1e90c30180bcd478d918a0"`);
        await queryRunner.query(`DROP TABLE "meteo_cities"`);
        await queryRunner.query(`DROP TABLE "meteo_temps"`);
    }

}
