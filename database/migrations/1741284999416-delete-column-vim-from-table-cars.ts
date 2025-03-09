import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteColumnVimFromTableCars1741284999416 implements MigrationInterface {
    name = 'DeleteColumnVimFromTableCars1741284999416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "vim"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" ADD "vim" character varying NOT NULL`);
    }

}
