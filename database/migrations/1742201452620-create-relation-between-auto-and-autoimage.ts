import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelationBetweenAutoAndAutoimage1742201452620
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE auto_image 
        ADD COLUMN auto_id UUID NOT NULL,
        ADD CONSTRAINT fk_auto FOREIGN KEY (auto_id) REFERENCES auto(id) ON DELETE CASCADE;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE auto_image 
        DROP CONSTRAINT fk_auto,
        DROP COLUMN auto_id;
      `);
  }
}
