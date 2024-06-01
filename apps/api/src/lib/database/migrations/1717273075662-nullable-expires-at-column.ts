import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableExpiresAtColumn1717273075662
  implements MigrationInterface
{
  name = 'NullableExpiresAtColumn1717273075662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "expires_at" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "expires_at" SET NOT NULL`,
    );
  }
}
