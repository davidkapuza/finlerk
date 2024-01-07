import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTables1704633046678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user" RENAME TO "user_entity"');
    await queryRunner.query('ALTER TABLE "status" RENAME TO "status_entity"');
    await queryRunner.query('ALTER TABLE "role" RENAME TO "role_entity"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "user_entity" RENAME TO "user"');
    await queryRunner.query('ALTER TABLE "status_entity" RENAME TO "status"');
    await queryRunner.query('ALTER TABLE "role_entity" RENAME TO "role"');
  }
}
