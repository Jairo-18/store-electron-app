import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedHotelRelations1762123517305 implements MigrationInterface {
    name = 'AddedHotelRelations1762123517305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Hotel" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "code" character varying(50) NOT NULL, "legalName" character varying(255) NOT NULL, "identificationNumber" character varying(50) NOT NULL, "email" character varying(150) NOT NULL, "city" character varying(100) NOT NULL, "department" character varying(100) NOT NULL, "address" character varying(255) NOT NULL, "website" character varying(255), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "phoneCodeId" integer NOT NULL, CONSTRAINT "UQ_941f365401eeae14b5a1ab681e7" UNIQUE ("code"), CONSTRAINT "UQ_6fb59c71bf2d1a659791a3b4c29" UNIQUE ("identificationNumber"), CONSTRAINT "UQ_af4788a7065d0a30cd9a8873772" UNIQUE ("email"), CONSTRAINT "PK_3cc16b686a5501a152fd177933f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Service" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Product" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Invoice" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Balance" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "User" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Service" ADD CONSTRAINT "FK_dc4dbd9ec989441d650c76eb0f1" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD CONSTRAINT "FK_be00040c19f1406618338bf83c1" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_6a729de809f987bd01a627d5675" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD CONSTRAINT "FK_293b92df97d5fb1a76a63c16ed9" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Invoice" ADD CONSTRAINT "FK_ec2625fe1f53f46303c13b8f8c8" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Balance" ADD CONSTRAINT "FK_f21dcd2ebe9d74b50f9297ca8a0" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" ADD CONSTRAINT "FK_9dcd30936f221cfbbb58d5e603a" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Hotel" ADD CONSTRAINT "FK_fb1f0fedd95b0438158c74d1013" FOREIGN KEY ("phoneCodeId") REFERENCES "phone_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_57255d6c152cf927d360980739b" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_57255d6c152cf927d360980739b"`);
        await queryRunner.query(`ALTER TABLE "Hotel" DROP CONSTRAINT "FK_fb1f0fedd95b0438158c74d1013"`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" DROP CONSTRAINT "FK_9dcd30936f221cfbbb58d5e603a"`);
        await queryRunner.query(`ALTER TABLE "Balance" DROP CONSTRAINT "FK_f21dcd2ebe9d74b50f9297ca8a0"`);
        await queryRunner.query(`ALTER TABLE "Invoice" DROP CONSTRAINT "FK_ec2625fe1f53f46303c13b8f8c8"`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP CONSTRAINT "FK_293b92df97d5fb1a76a63c16ed9"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_6a729de809f987bd01a627d5675"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP CONSTRAINT "FK_be00040c19f1406618338bf83c1"`);
        await queryRunner.query(`ALTER TABLE "Service" DROP CONSTRAINT "FK_dc4dbd9ec989441d650c76eb0f1"`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Balance" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Invoice" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Service" DROP COLUMN "hotelId"`);
        await queryRunner.query(`DROP TABLE "Hotel"`);
    }

}
