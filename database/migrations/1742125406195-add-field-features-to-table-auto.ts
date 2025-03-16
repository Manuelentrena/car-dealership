import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFieldFeaturesToTableAuto1742125406195
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Añadir el nuevo campo 'features' como un array de texto
    await queryRunner.query(`
        ALTER TABLE "auto"
        ADD "features" text[] DEFAULT '{}'
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar el campo 'features'
    await queryRunner.query(`
        ALTER TABLE "auto"
        DROP COLUMN "features"
      `);
  }
}
