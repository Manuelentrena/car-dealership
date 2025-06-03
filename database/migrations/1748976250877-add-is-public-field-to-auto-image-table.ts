import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsPublicFieldToAutoImageTable1748976250877
  implements MigrationInterface
{
  name = 'AddIsPublicFieldToAutoImageTable1748976250877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auto_image" DROP CONSTRAINT "fk_auto"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auto_image" ADD "isPublic" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "auto_image" ALTER COLUMN "createdAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auto_image" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "auto_image" ALTER COLUMN "auto_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auto_image" ADD CONSTRAINT "FK_240ff9ecd9556b069d53ad2da57" FOREIGN KEY ("auto_id") REFERENCES "auto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auto_image" DROP CONSTRAINT "FK_240ff9ecd9556b069d53ad2da57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auto_image" ALTER COLUMN "auto_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auto_image" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "auto_image" ALTER COLUMN "createdAt" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "auto_image" DROP COLUMN "isPublic"`);
    await queryRunner.query(
      `ALTER TABLE "auto_image" ADD CONSTRAINT "fk_auto" FOREIGN KEY ("auto_id") REFERENCES "auto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
