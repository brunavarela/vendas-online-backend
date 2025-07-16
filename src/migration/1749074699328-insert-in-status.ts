import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertStatus1676323439062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
<<<<<<< HEAD:src/migration/1749074699328-insert-in-status.ts
    queryRunner.query(`
            INSERT INTO public.payment_status(id, name)	VALUES (1, 'Done');
        `);
=======
    // queryRunner.query(`
    //         ALTER TABLE state
    //             ADD uf varchar(2) NOT NULL;
    //     `);
>>>>>>> develop:src/migration/1739837973626-alter-table-state.ts
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM public.payment_status WHERE id = 1;
        `);
  }
}
