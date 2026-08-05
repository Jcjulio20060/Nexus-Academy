#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/015991fe7889faae04a08dc94e4d74c98008c3950aeb00ba2e3c2bad618e79dc/contract';
import startContract from '../../snapshots/015991fe7889faae04a08dc94e4d74c98008c3950aeb00ba2e3c2bad618e79dc/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/6613c0bd668b83d6745f2fca52de245b11cc4c4c385dd6da4923860503e0c734/contract';
import endContract from '../../snapshots/6613c0bd668b83d6745f2fca52de245b11cc4c4c385dd6da4923860503e0c734/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'absenceJustification',
        column: col('cadeiraId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'cadeira',
        column: col('semester', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'absenceJustification',
        index: 'absenceJustification_cadeiraId_idx_5b4025a7',
        columns: ['cadeiraId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'absenceJustification',
        foreignKey: {
          name: 'absenceJustification_cadeiraId_fkey',
          columns: ['cadeiraId'],
          references: { schema: 'public', table: 'cadeira', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
