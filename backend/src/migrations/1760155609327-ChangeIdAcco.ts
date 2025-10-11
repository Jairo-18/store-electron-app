import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIdAcco1760155609327 implements MigrationInterface {
    name = 'ChangeIdAcco1760155609327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Accommodation" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(500), "amountPerson" integer NOT NULL, "jacuzzi" boolean NOT NULL, "amountRoom" integer NOT NULL, "amountBathroom" integer NOT NULL, "priceBuy" numeric(10,2) NOT NULL, "priceSale" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "stateTypeId" integer, "bedTypeId" integer, "categoryTypeId" integer, CONSTRAINT "PK_5797c090fd5819ce0dfbceb50a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD "accommodationId" integer`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD CONSTRAINT "FK_1bd05b770f0fe8177e11e799413" FOREIGN KEY ("stateTypeId") REFERENCES "StateType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD CONSTRAINT "FK_d55dcfa2f0dc891973026904813" FOREIGN KEY ("bedTypeId") REFERENCES "BedType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD CONSTRAINT "FK_20a675305f82463e7e98f83012e" FOREIGN KEY ("categoryTypeId") REFERENCES "CategoryType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD CONSTRAINT "FK_05bdbed4cb3a8e2f8f15bccd6d5" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP CONSTRAINT "FK_05bdbed4cb3a8e2f8f15bccd6d5"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP CONSTRAINT "FK_20a675305f82463e7e98f83012e"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP CONSTRAINT "FK_d55dcfa2f0dc891973026904813"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP CONSTRAINT "FK_1bd05b770f0fe8177e11e799413"`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP COLUMN "accommodationId"`);
        await queryRunner.query(`DROP TABLE "Accommodation"`);
    }

}
