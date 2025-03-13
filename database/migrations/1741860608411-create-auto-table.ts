import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAutoTable1741860608411 implements MigrationInterface {
  name = 'CreateAutoTable1741860608411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auto" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP DEFAULT now(),
            "deletedAt" TIMESTAMP,
            "brand" character varying NOT NULL,
            "model" character varying NOT NULL,
            "year" integer NOT NULL,
            CONSTRAINT "PK_0c3035ffcce0eac94e9284d8237" PRIMARY KEY ("id")
        )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auto"`);
  }
}
