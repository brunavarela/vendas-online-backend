import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertStatus1676323439062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // queryRunner.query(`
    //         ALTER TABLE state
    //             ADD uf varchar(2) NOT NULL;
    //     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public.payment_status WHERE id = 1;
        `);
  }
}
