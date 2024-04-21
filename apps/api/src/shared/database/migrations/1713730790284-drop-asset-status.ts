import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropAssetStatus1713730790284 implements MigrationInterface {
  name = 'AssetTable1713730790284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9822ea5944bcde3771ebe16d86"`,
    );
    await queryRunner.query(`ALTER TABLE "asset" DROP COLUMN "status"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "asset" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9822ea5944bcde3771ebe16d86" ON "asset" ("status") `,
    );
  }
}
