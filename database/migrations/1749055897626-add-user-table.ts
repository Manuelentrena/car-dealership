import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1749055897626 implements MigrationInterface {
  name = 'AddUserTable1749055897626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "deletedAt" TIMESTAMP, "email" text NOT NULL, "fullName" text NOT NULL, "password" text NOT NULL, "activationToken" character varying, "isActive" boolean NOT NULL DEFAULT true, "roles" text array NOT NULL DEFAULT '{user}', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
