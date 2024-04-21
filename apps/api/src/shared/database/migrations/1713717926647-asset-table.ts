import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssetTable1713717926647 implements MigrationInterface {
  name = 'AssetColumn1713717926647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "asset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "class" character varying NOT NULL, "exchange" character varying NOT NULL, "symbol" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c23ef2ec2e636d9c2fae43192" ON "asset" ("class") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_92eaf5e004d0c2bd907d8c1f58" ON "asset" ("exchange") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45b83954906fc214e750ba5328" ON "asset" ("symbol") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9822ea5944bcde3771ebe16d86" ON "asset" ("status") `,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photoId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "photoId" uuid`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9822ea5944bcde3771ebe16d86"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_45b83954906fc214e750ba5328"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_92eaf5e004d0c2bd907d8c1f58"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1c23ef2ec2e636d9c2fae43192"`,
    );
    await queryRunner.query(`DROP TABLE "asset"`);
  }
}
