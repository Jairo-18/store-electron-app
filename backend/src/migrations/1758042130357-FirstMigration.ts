import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1758042130357 implements MigrationInterface {
  name = 'FirstMigration1758042130357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "phone_code" ("id" SERIAL NOT NULL, "code" character varying(255), "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_63535b596f66607b3da0ead52e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "IdentificationType" ("id" SERIAL NOT NULL, "code" character varying(255), "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_aedcbc9af0a1714d6e2d058db99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "RoleType" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(255), "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ef07949fab6014eba570105c708" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "PayType" ("id" SERIAL NOT NULL, "code" character varying(255), "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_07be32ac851522909a67d6d7d6c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "PaidType" ("id" SERIAL NOT NULL, "code" character varying(255), "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_371c4c04d21f6bdd9ebe89d49cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "TaxeType" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "percentage" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2fade5c838371a58efa0adb2bab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CategoryType" ("id" SERIAL NOT NULL, "code" character varying(255), "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_31c6303881c2639f14726a9d786" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Product" ("id" SERIAL NOT NULL, "code" character varying(255), "name" character varying(255), "description" character varying(500), "amount" numeric(10,2) NOT NULL, "priceBuy" numeric(10,2) NOT NULL, "priceSale" numeric(10,2) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "categoryTypeId" integer, CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "InvoiceDetaill" ("invoiceDetaillId" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "priceBuy" numeric(10,2) NOT NULL, "priceWithoutTax" numeric(10,2) NOT NULL, "taxe" numeric DEFAULT '0', "priceWithTax" numeric(10,2) NOT NULL, "subtotal" numeric(10,2) NOT NULL, "startDate" TIMESTAMP, "endDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "invoiceId" integer, "productId" integer, "taxeTypeId" integer, CONSTRAINT "PK_3f16147788e1fa79a45df439710" PRIMARY KEY ("invoiceDetaillId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "InvoiceType" ("id" SERIAL NOT NULL, "code" character varying(255), "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8a6b2123d23bf5a6ba7e120f43d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Invoice" ("invoiceId" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "observations" character varying(500), "invoiceElectronic" boolean NOT NULL DEFAULT false, "subtotalWithoutTax" numeric(10,2) NOT NULL DEFAULT '0', "subtotalWithTax" numeric(10,2) NOT NULL DEFAULT '0', "transfer" numeric(10,2) DEFAULT '0', "cash" numeric(10,2) DEFAULT '0', "total" numeric(10,2) NOT NULL DEFAULT '0', "startDate" date NOT NULL, "endDate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "invoiceTypeId" integer, "userId" uuid, "employeeId" uuid, "paidTypeId" integer, "payTypeId" integer, CONSTRAINT "UQ_invoice_code_per_type" UNIQUE ("code", "invoiceTypeId"), CONSTRAINT "PK_8a887d82ac7b6a543d43508a655" PRIMARY KEY ("invoiceId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "identificationNumber" character varying(50) NOT NULL, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying(150), "phone" character varying(25), "password" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "phoneCodeId" integer, "roleTypeId" uuid, "identificationTypeId" integer, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Balance_type_enum" AS ENUM('daily', 'weekly', 'monthly', 'yearly')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Balance" ("id" SERIAL NOT NULL, "type" "public"."Balance_type_enum" NOT NULL, "periodDate" date NOT NULL, "totalInvoiceSale" numeric(12,2) NOT NULL DEFAULT '0', "totalInvoiceBuy" numeric(12,2) NOT NULL DEFAULT '0', "balanceInvoice" numeric(12,2) NOT NULL DEFAULT '0', "totalProductPriceSale" numeric(12,2) NOT NULL DEFAULT '0', "totalProductPriceBuy" numeric(12,2) NOT NULL DEFAULT '0', "balanceProduct" numeric(12,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2aa37c798b86e725e0db763c993" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b3612ca41f34192567c3129bc1" ON "Balance" ("type", "periodDate") `,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" ADD CONSTRAINT "FK_10b9d612c2f1de13ceafd5b6acd" FOREIGN KEY ("categoryTypeId") REFERENCES "CategoryType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "InvoiceDetaill" ADD CONSTRAINT "FK_0a7017cdeb1b5c9664fc3bd411e" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("invoiceId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "InvoiceDetaill" ADD CONSTRAINT "FK_bcfb0a9a4d66209ee1ffabc8606" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "InvoiceDetaill" ADD CONSTRAINT "FK_5cde995d555967b1181c14aeb65" FOREIGN KEY ("taxeTypeId") REFERENCES "TaxeType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" ADD CONSTRAINT "FK_73894baf4f415bd706bfb40d7c5" FOREIGN KEY ("invoiceTypeId") REFERENCES "InvoiceType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" ADD CONSTRAINT "FK_a2606dadaf493db28be41e7e45c" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" ADD CONSTRAINT "FK_bdc12956409123f1fbcc48dd3fd" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" ADD CONSTRAINT "FK_bf35a910178ae13aed480799351" FOREIGN KEY ("paidTypeId") REFERENCES "PaidType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" ADD CONSTRAINT "FK_8d7ceb2d380b7ccd53bfce81bb5" FOREIGN KEY ("payTypeId") REFERENCES "PayType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD CONSTRAINT "FK_efe6b0ecd9b81fb1520edfbc4fb" FOREIGN KEY ("phoneCodeId") REFERENCES "phone_code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD CONSTRAINT "FK_53a59cb597a54e64678708ae3a6" FOREIGN KEY ("roleTypeId") REFERENCES "RoleType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" ADD CONSTRAINT "FK_4b60684d74be512dab8f840ad01" FOREIGN KEY ("identificationTypeId") REFERENCES "IdentificationType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" DROP CONSTRAINT "FK_4b60684d74be512dab8f840ad01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" DROP CONSTRAINT "FK_53a59cb597a54e64678708ae3a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "User" DROP CONSTRAINT "FK_efe6b0ecd9b81fb1520edfbc4fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" DROP CONSTRAINT "FK_8d7ceb2d380b7ccd53bfce81bb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" DROP CONSTRAINT "FK_bf35a910178ae13aed480799351"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" DROP CONSTRAINT "FK_bdc12956409123f1fbcc48dd3fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" DROP CONSTRAINT "FK_a2606dadaf493db28be41e7e45c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invoice" DROP CONSTRAINT "FK_73894baf4f415bd706bfb40d7c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "InvoiceDetaill" DROP CONSTRAINT "FK_5cde995d555967b1181c14aeb65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "InvoiceDetaill" DROP CONSTRAINT "FK_bcfb0a9a4d66209ee1ffabc8606"`,
    );
    await queryRunner.query(
      `ALTER TABLE "InvoiceDetaill" DROP CONSTRAINT "FK_0a7017cdeb1b5c9664fc3bd411e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" DROP CONSTRAINT "FK_10b9d612c2f1de13ceafd5b6acd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b3612ca41f34192567c3129bc1"`,
    );
    await queryRunner.query(`DROP TABLE "Balance"`);
    await queryRunner.query(`DROP TYPE "public"."Balance_type_enum"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TABLE "Invoice"`);
    await queryRunner.query(`DROP TABLE "InvoiceType"`);
    await queryRunner.query(`DROP TABLE "InvoiceDetaill"`);
    await queryRunner.query(`DROP TABLE "Product"`);
    await queryRunner.query(`DROP TABLE "CategoryType"`);
    await queryRunner.query(`DROP TABLE "TaxeType"`);
    await queryRunner.query(`DROP TABLE "PaidType"`);
    await queryRunner.query(`DROP TABLE "PayType"`);
    await queryRunner.query(`DROP TABLE "RoleType"`);
    await queryRunner.query(`DROP TABLE "IdentificationType"`);
    await queryRunner.query(`DROP TABLE "phone_code"`);
  }
}
