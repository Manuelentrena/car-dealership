import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateAutosWithFeatures1742125568938
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Array de características aleatorias
    const randomFeatures = [
      'Bluetooth',
      'Aire acondicionado',
      'Navegación GPS',
      'Cámara de reversa',
      'Techo panorámico',
      'Asientos de cuero',
      'Sensores de estacionamiento',
      'Control de crucero',
      'Faros LED',
      'Sistema de sonido premium',
    ];

    const autos = await queryRunner.query(`SELECT "id" FROM "auto"`);

    for (const auto of autos) {
      const features = [];
      while (features.length < 3) {
        const randomFeature =
          randomFeatures[Math.floor(Math.random() * randomFeatures.length)];
        if (!features.includes(randomFeature)) {
          features.push(randomFeature);
        }
      }

      // Actualizar el campo 'features' para cada auto
      await queryRunner.query(
        `
        UPDATE "auto"
        SET "features" = $1
        WHERE "id" = $2
      `,
        [features, auto.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Opcional: Si quieres revertir la migración y vaciar los features
    await queryRunner.query(`
        UPDATE "auto"
        SET "features" = '{}'
      `);
  }
}
