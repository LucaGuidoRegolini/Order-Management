import {MigrationInterface, QueryRunner} from "typeorm";

export class createDealTable1654341909682 implements MigrationInterface {
    name = 'createDealTable1654341909682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pipedrive_id" integer NOT NULL, "title" character varying NOT NULL, "value" integer NOT NULL, "product_count" integer NOT NULL, "user_pipedrive_id" integer NOT NULL, "client_id" uuid NOT NULL, "user_id" uuid NOT NULL, "deal_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c66f03b250f613ff8615940b4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "emails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" uuid, CONSTRAINT "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_pipedrive_id" integer NOT NULL, "name" character varying NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_7a1770366da1de36b1efc628073" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_5cf0f8f1822d7ecc44eed1db44f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "emails" ADD CONSTRAINT "FK_d8e293448e0fe8cede82e9ee6d4" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_07a7a09b04e7b035c9d90cf4984" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_07a7a09b04e7b035c9d90cf4984"`);
        await queryRunner.query(`ALTER TABLE "emails" DROP CONSTRAINT "FK_d8e293448e0fe8cede82e9ee6d4"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_5cf0f8f1822d7ecc44eed1db44f"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_7a1770366da1de36b1efc628073"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "emails"`);
        await queryRunner.query(`DROP TABLE "deals"`);
    }

}
