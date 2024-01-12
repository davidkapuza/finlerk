import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamedEntities1704632380911 implements MigrationInterface {
  name = 'RenamedEntities1704632380911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_entity" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_7bc1bd2364b6e9bf7c84b1e52e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status_entity" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_ff91c3dc49aee4d7911093467cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "status_entity"`);
    await queryRunner.query(`DROP TABLE "role_entity"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
