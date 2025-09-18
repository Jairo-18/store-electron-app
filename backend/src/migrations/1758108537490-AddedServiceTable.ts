import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedServiceTable1758108537490 implements MigrationInterface {
    name = 'AddedServiceTable1758108537490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Service" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(500), "priceBuy" numeric(10,2) NOT NULL, "priceSale" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "categoryTypeId" integer, CONSTRAINT "PK_c77cf540affcc8a04962fc6e9f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Service" ADD CONSTRAINT "FK_a50ad7b9dd46710d481a013d3b4" FOREIGN KEY ("categoryTypeId") REFERENCES "CategoryType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Service" DROP CONSTRAINT "FK_a50ad7b9dd46710d481a013d3b4"`);
        await queryRunner.query(`DROP TABLE "Service"`);
    }

}
