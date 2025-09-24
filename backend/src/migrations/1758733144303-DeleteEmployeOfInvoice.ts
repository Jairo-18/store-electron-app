import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteEmployeOfInvoice1758733144303 implements MigrationInterface {
    name = 'DeleteEmployeOfInvoice1758733144303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Invoice" DROP CONSTRAINT "FK_bdc12956409123f1fbcc48dd3fd"`);
        await queryRunner.query(`ALTER TABLE "Invoice" DROP COLUMN "employeeId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Invoice" ADD "employeeId" uuid`);
        await queryRunner.query(`ALTER TABLE "Invoice" ADD CONSTRAINT "FK_bdc12956409123f1fbcc48dd3fd" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
