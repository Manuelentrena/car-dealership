import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableCars1741207407393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'car', // Nombre de la tabla
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid', // Genera UUID automáticamente
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamptz',
            isNullable: true, // Puede ser nulo
          },
          {
            name: 'brand',
            type: 'varchar', // Usa varchar para cadenas
          },
          {
            name: 'model',
            type: 'varchar', // Usa varchar para cadenas
          },
          {
            name: 'year',
            type: 'int', // Usa int para el año
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir cambios: eliminar la tabla 'car'
    await queryRunner.dropTable('car');
  }
}
