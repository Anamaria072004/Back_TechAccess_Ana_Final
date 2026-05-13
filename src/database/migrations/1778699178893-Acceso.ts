import { MigrationInterface, QueryRunner } from "typeorm";

export class Acceso1778699178893 implements MigrationInterface {
    name = 'Acceso1778699178893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accesos" DROP COLUMN "horaIngreso"`);
        await queryRunner.query(`ALTER TABLE "accesos" DROP COLUMN "horaSalida"`);
        await queryRunner.query(`ALTER TABLE "accesos" DROP COLUMN "fecha"`);
        await queryRunner.query(`ALTER TABLE "accesos" ADD "horaFecha" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "accesos" ADD "accion" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accesos" DROP COLUMN "accion"`);
        await queryRunner.query(`ALTER TABLE "accesos" DROP COLUMN "horaFecha"`);
        await queryRunner.query(`ALTER TABLE "accesos" ADD "fecha" date NOT NULL DEFAULT ('now'::text)::date`);
        await queryRunner.query(`ALTER TABLE "accesos" ADD "horaSalida" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "accesos" ADD "horaIngreso" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
