import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameImageTable1758370348907 implements MigrationInterface {
    name = 'ChangeNameImageTable1758370348907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ImageProduct" ("id" SERIAL NOT NULL, "filePath" character varying(500) NOT NULL, "originalName" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "productId" integer, CONSTRAINT "PK_f6dfe0be6b8dfbfe03ecc253a0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ImageProduct" ADD CONSTRAINT "FK_b58ab95b5697602eacfbf4ee6ef" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ImageProduct" DROP CONSTRAINT "FK_b58ab95b5697602eacfbf4ee6ef"`);
        await queryRunner.query(`DROP TABLE "ImageProduct"`);
    }

}
