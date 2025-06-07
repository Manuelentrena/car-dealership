import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAutoRelation1749142250157 implements MigrationInterface {
  name = 'AddUserAutoRelation1749142250157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auto" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "auto" ADD CONSTRAINT "FK_b34969f603e917ba269f933e341" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auto" DROP CONSTRAINT "FK_b34969f603e917ba269f933e341"`,
    );
    await queryRunner.query(`ALTER TABLE "auto" DROP COLUMN "userId"`);
  }
}
