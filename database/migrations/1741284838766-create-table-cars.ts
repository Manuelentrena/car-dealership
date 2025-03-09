import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCars1741284838766 implements MigrationInterface {
    name = 'CreateTableCars1741284838766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "brand" character varying NOT NULL, "model" character varying NOT NULL, "vim" character varying NOT NULL, "year" integer NOT NULL, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "car"`);
    }

}
