import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamedEntities1704633502657 implements MigrationInterface {
  name = 'RenamedEntities1704633502657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "user_entity_id_seq" OWNED BY "user_entity"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ALTER COLUMN "id" SET DEFAULT nextval('"user_entity_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5bab7e4ab7093623c5d06461c" ON "user_entity" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f2dda8af4def80688e670e1a14" ON "user_entity" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bd48799d4fcc841fbda47b95f8" ON "user_entity" ("lastName") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_1f32df129318e4ac4e1cc10895e" FOREIGN KEY ("statusId") REFERENCES "status_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_1f32df129318e4ac4e1cc10895e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bd48799d4fcc841fbda47b95f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f2dda8af4def80688e670e1a14"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f5bab7e4ab7093623c5d06461c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "user_entity_id_seq"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user_entity" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user_entity" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user_entity" ("socialId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
