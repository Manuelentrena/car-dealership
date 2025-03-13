import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldSlugToTableAuto1741884147553
  implements MigrationInterface
{
  name = 'AddFieldSlugToTableAuto1741884147553';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "auto" 
      ADD "slug" text UNIQUE;
    `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "auto" 
        DROP COLUMN "slug";
    `);
  }
}
