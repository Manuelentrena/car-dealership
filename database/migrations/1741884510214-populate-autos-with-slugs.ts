import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateAutosWithSlugs1741884510214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Actualizar los registros existentes con el slug generado
    await queryRunner.query(
      `UPDATE auto SET slug = CONCAT(LOWER(REPLACE(brand, ' ', '-')), '-', LOWER(REPLACE(model, ' ', '-')), '-', year) WHERE slug IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
