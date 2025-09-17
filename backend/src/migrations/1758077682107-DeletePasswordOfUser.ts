import { MigrationInterface, QueryRunner } from "typeorm";

export class DeletePasswordOfUser1758077682107 implements MigrationInterface {
    name = 'DeletePasswordOfUser1758077682107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" ADD "password" character varying(255) NOT NULL`);
    }

}
