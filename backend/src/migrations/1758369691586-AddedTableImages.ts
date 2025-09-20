import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTableImages1758369691586 implements MigrationInterface {
    name = 'AddedTableImages1758369691586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Image" ("id" SERIAL NOT NULL, "filePath" character varying(500) NOT NULL, "originalName" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "productId" integer, CONSTRAINT "PK_ddecd6b02f6dd0d3d10a0a74717" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Image" ADD CONSTRAINT "FK_c5c304be8b03758812750c64e96" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Image" DROP CONSTRAINT "FK_c5c304be8b03758812750c64e96"`);
        await queryRunner.query(`DROP TABLE "Image"`);
    }

}
