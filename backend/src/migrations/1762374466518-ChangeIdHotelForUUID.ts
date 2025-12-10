import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIdHotelForUUID1762374466518 implements MigrationInterface {
    name = 'ChangeIdHotelForUUID1762374466518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Service" DROP CONSTRAINT "FK_dc4dbd9ec989441d650c76eb0f1"`);
        await queryRunner.query(`ALTER TABLE "Service" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Service" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP CONSTRAINT "FK_be00040c19f1406618338bf83c1"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_6a729de809f987bd01a627d5675"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Product" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP CONSTRAINT "FK_293b92df97d5fb1a76a63c16ed9"`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "Invoice" DROP CONSTRAINT "FK_ec2625fe1f53f46303c13b8f8c8"`);
        await queryRunner.query(`ALTER TABLE "Invoice" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Invoice" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "Balance" DROP CONSTRAINT "FK_f21dcd2ebe9d74b50f9297ca8a0"`);
        await queryRunner.query(`ALTER TABLE "Balance" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Balance" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" DROP CONSTRAINT "FK_9dcd30936f221cfbbb58d5e603a"`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_57255d6c152cf927d360980739b"`);
        await queryRunner.query(`ALTER TABLE "Hotel" DROP CONSTRAINT "PK_3cc16b686a5501a152fd177933f"`);
        await queryRunner.query(`ALTER TABLE "Hotel" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "Hotel" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "Hotel" ADD CONSTRAINT "PK_3cc16b686a5501a152fd177933f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "User" ADD "hotelId" uuid`);
        await queryRunner.query(`ALTER TABLE "Service" ADD CONSTRAINT "FK_dc4dbd9ec989441d650c76eb0f1" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD CONSTRAINT "FK_be00040c19f1406618338bf83c1" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_6a729de809f987bd01a627d5675" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD CONSTRAINT "FK_293b92df97d5fb1a76a63c16ed9" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Invoice" ADD CONSTRAINT "FK_ec2625fe1f53f46303c13b8f8c8" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Balance" ADD CONSTRAINT "FK_f21dcd2ebe9d74b50f9297ca8a0" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" ADD CONSTRAINT "FK_9dcd30936f221cfbbb58d5e603a" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_57255d6c152cf927d360980739b" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_57255d6c152cf927d360980739b"`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" DROP CONSTRAINT "FK_9dcd30936f221cfbbb58d5e603a"`);
        await queryRunner.query(`ALTER TABLE "Balance" DROP CONSTRAINT "FK_f21dcd2ebe9d74b50f9297ca8a0"`);
        await queryRunner.query(`ALTER TABLE "Invoice" DROP CONSTRAINT "FK_ec2625fe1f53f46303c13b8f8c8"`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP CONSTRAINT "FK_293b92df97d5fb1a76a63c16ed9"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_6a729de809f987bd01a627d5675"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP CONSTRAINT "FK_be00040c19f1406618338bf83c1"`);
        await queryRunner.query(`ALTER TABLE "Service" DROP CONSTRAINT "FK_dc4dbd9ec989441d650c76eb0f1"`);
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "User" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Hotel" DROP CONSTRAINT "PK_3cc16b686a5501a152fd177933f"`);
        await queryRunner.query(`ALTER TABLE "Hotel" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "Hotel" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Hotel" ADD CONSTRAINT "PK_3cc16b686a5501a152fd177933f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_57255d6c152cf927d360980739b" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "AccessSessions" ADD CONSTRAINT "FK_9dcd30936f221cfbbb58d5e603a" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Balance" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Balance" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Balance" ADD CONSTRAINT "FK_f21dcd2ebe9d74b50f9297ca8a0" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Invoice" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Invoice" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Invoice" ADD CONSTRAINT "FK_ec2625fe1f53f46303c13b8f8c8" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD CONSTRAINT "FK_293b92df97d5fb1a76a63c16ed9" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Product" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_6a729de809f987bd01a627d5675" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Accommodation" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Accommodation" ADD CONSTRAINT "FK_be00040c19f1406618338bf83c1" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Service" DROP COLUMN "hotelId"`);
        await queryRunner.query(`ALTER TABLE "Service" ADD "hotelId" integer`);
        await queryRunner.query(`ALTER TABLE "Service" ADD CONSTRAINT "FK_dc4dbd9ec989441d650c76eb0f1" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
