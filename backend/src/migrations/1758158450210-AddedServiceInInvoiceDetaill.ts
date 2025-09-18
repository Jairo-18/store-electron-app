import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedServiceInInvoiceDetaill1758158450210 implements MigrationInterface {
    name = 'AddedServiceInInvoiceDetaill1758158450210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD "serviceId" integer`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" ADD CONSTRAINT "FK_dcb73778ec7f3381a859c6cd237" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP CONSTRAINT "FK_dcb73778ec7f3381a859c6cd237"`);
        await queryRunner.query(`ALTER TABLE "InvoiceDetaill" DROP COLUMN "serviceId"`);
    }

}
