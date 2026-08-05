#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/015991fe7889faae04a08dc94e4d74c98008c3950aeb00ba2e3c2bad618e79dc/contract';
import endContract from '../../snapshots/015991fe7889faae04a08dc94e4d74c98008c3950aeb00ba2e3c2bad618e79dc/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'absenceJustification',
        columns: [
          col('alunoId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('endDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('proofUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('reason', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('response', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('reviewedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz@1' } }),
          col('reviewedById', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('startDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('submittedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'aluno',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('course', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('registrationNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('year', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'arquivo',
        columns: [
          col('alunoId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('cadeiraId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('category', 'text', {
            notNull: true,
            default: lit('MATERIAL'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('professorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('uploadedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('uploadedById', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('visible', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'cadeira',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('credits', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('teacherId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'fAQ',
        columns: [
          col('answer', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('category', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('question', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'horario',
        columns: [
          col('cadeiraId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('day', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('endTime', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('location', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('professorId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('startTime', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'importantDate',
        columns: [
          col('allDay', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('category', 'text', {
            notNull: true,
            default: lit('OTHER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('createdById', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('date', 'timestamptz', { notNull: true, codecRef: { codecId: 'pg/timestamptz@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('endDate', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('location', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('relatedCadeiraId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('visible', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'matricula',
        columns: [
          col('alunoId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('cadeiraId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('enrolledAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('grade', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('ENROLLED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'notice',
        columns: [
          col('audience', 'text', {
            notNull: true,
            default: lit('ALL'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('category', 'text', {
            notNull: true,
            default: lit('GENERAL'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdById', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('expiresAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isPinned', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('publishedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('visible', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'professor',
        columns: [
          col('active', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('bio', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('department', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('employeeNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ticket',
        columns: [
          col('assignedToId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('priority', 'text', {
            notNull: true,
            default: lit('MEDIUM'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('requesterId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('OPEN'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('subject', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ticketMessage',
        columns: [
          col('body', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('internal', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('senderId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('ticketId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('STUDENT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('username', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'aluno',
        constraint: 'aluno_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'aluno',
        constraint: 'aluno_registrationNumber_key',
        columns: ['registrationNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'cadeira',
        constraint: 'cadeira_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'matricula',
        constraint: 'matricula_alunoId_cadeiraId_key',
        columns: ['alunoId', 'cadeiraId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'professor',
        constraint: 'professor_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'professor',
        constraint: 'professor_employeeNumber_key',
        columns: ['employeeNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_username_key',
        columns: ['username'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'absenceJustification',
        constraint: 'absenceJustification_status_check',
        column: 'status',
        values: ['PENDING', 'APPROVED', 'REJECTED'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'arquivo',
        constraint: 'arquivo_category_check',
        column: 'category',
        values: ['MATERIAL', 'DOCUMENT', 'ANNOUNCEMENT', 'OTHER'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'horario',
        constraint: 'horario_day_check',
        column: 'day',
        values: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'importantDate',
        constraint: 'importantDate_category_check',
        column: 'category',
        values: ['EXAM', 'PROJECT', 'ACTIVITY', 'DEADLINE', 'EVENT', 'OTHER'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'matricula',
        constraint: 'matricula_status_check',
        column: 'status',
        values: ['ENROLLED', 'WAITLISTED', 'DROPPED', 'COMPLETED'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'notice',
        constraint: 'notice_category_check',
        column: 'category',
        values: ['GENERAL', 'ALERT', 'MAINTENANCE', 'REMINDER'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'notice',
        constraint: 'notice_audience_check',
        column: 'audience',
        values: ['ALL', 'STUDENTS', 'TEACHERS', 'STAFF'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'ticket',
        constraint: 'ticket_status_check',
        column: 'status',
        values: ['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'ticket',
        constraint: 'ticket_priority_check',
        column: 'priority',
        values: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'user',
        constraint: 'user_role_check',
        column: 'role',
        values: ['STUDENT', 'TEACHER', 'ADMIN', 'STAFF'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'absenceJustification',
        index: 'absenceJustification_alunoId_idx_61a7e8dd',
        columns: ['alunoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'absenceJustification',
        index: 'absenceJustification_reviewedById_idx_e2835478',
        columns: ['reviewedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'arquivo',
        index: 'arquivo_alunoId_idx_61a7e8dd',
        columns: ['alunoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'arquivo',
        index: 'arquivo_cadeiraId_idx_5b4025a7',
        columns: ['cadeiraId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'arquivo',
        index: 'arquivo_professorId_idx_f17aa655',
        columns: ['professorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'arquivo',
        index: 'arquivo_uploadedById_idx_b92fad21',
        columns: ['uploadedById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'cadeira',
        index: 'cadeira_teacherId_idx_bc266660',
        columns: ['teacherId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'horario',
        index: 'horario_cadeiraId_idx_5b4025a7',
        columns: ['cadeiraId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'horario',
        index: 'horario_professorId_idx_f17aa655',
        columns: ['professorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'importantDate',
        index: 'importantDate_createdById_idx_8bf640ed',
        columns: ['createdById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'importantDate',
        index: 'importantDate_relatedCadeiraId_idx_9eb78e1f',
        columns: ['relatedCadeiraId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'matricula',
        index: 'matricula_alunoId_idx_61a7e8dd',
        columns: ['alunoId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'matricula',
        index: 'matricula_cadeiraId_idx_5b4025a7',
        columns: ['cadeiraId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'notice',
        index: 'notice_createdById_idx_8bf640ed',
        columns: ['createdById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ticket',
        index: 'ticket_assignedToId_idx_45a131c2',
        columns: ['assignedToId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ticket',
        index: 'ticket_requesterId_idx_a5f4af92',
        columns: ['requesterId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ticketMessage',
        index: 'ticketMessage_senderId_idx_4689c490',
        columns: ['senderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ticketMessage',
        index: 'ticketMessage_ticketId_idx_2fe526c3',
        columns: ['ticketId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'absenceJustification',
        foreignKey: {
          name: 'absenceJustification_alunoId_fkey',
          columns: ['alunoId'],
          references: { schema: 'public', table: 'aluno', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'absenceJustification',
        foreignKey: {
          name: 'absenceJustification_reviewedById_fkey',
          columns: ['reviewedById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'aluno',
        foreignKey: {
          name: 'aluno_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'arquivo',
        foreignKey: {
          name: 'arquivo_uploadedById_fkey',
          columns: ['uploadedById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'arquivo',
        foreignKey: {
          name: 'arquivo_alunoId_fkey',
          columns: ['alunoId'],
          references: { schema: 'public', table: 'aluno', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'arquivo',
        foreignKey: {
          name: 'arquivo_professorId_fkey',
          columns: ['professorId'],
          references: { schema: 'public', table: 'professor', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'arquivo',
        foreignKey: {
          name: 'arquivo_cadeiraId_fkey',
          columns: ['cadeiraId'],
          references: { schema: 'public', table: 'cadeira', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'cadeira',
        foreignKey: {
          name: 'cadeira_teacherId_fkey',
          columns: ['teacherId'],
          references: { schema: 'public', table: 'professor', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'horario',
        foreignKey: {
          name: 'horario_cadeiraId_fkey',
          columns: ['cadeiraId'],
          references: { schema: 'public', table: 'cadeira', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'horario',
        foreignKey: {
          name: 'horario_professorId_fkey',
          columns: ['professorId'],
          references: { schema: 'public', table: 'professor', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'importantDate',
        foreignKey: {
          name: 'importantDate_relatedCadeiraId_fkey',
          columns: ['relatedCadeiraId'],
          references: { schema: 'public', table: 'cadeira', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'importantDate',
        foreignKey: {
          name: 'importantDate_createdById_fkey',
          columns: ['createdById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'matricula',
        foreignKey: {
          name: 'matricula_alunoId_fkey',
          columns: ['alunoId'],
          references: { schema: 'public', table: 'aluno', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'matricula',
        foreignKey: {
          name: 'matricula_cadeiraId_fkey',
          columns: ['cadeiraId'],
          references: { schema: 'public', table: 'cadeira', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'notice',
        foreignKey: {
          name: 'notice_createdById_fkey',
          columns: ['createdById'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'professor',
        foreignKey: {
          name: 'professor_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ticket',
        foreignKey: {
          name: 'ticket_requesterId_fkey',
          columns: ['requesterId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ticket',
        foreignKey: {
          name: 'ticket_assignedToId_fkey',
          columns: ['assignedToId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ticketMessage',
        foreignKey: {
          name: 'ticketMessage_ticketId_fkey',
          columns: ['ticketId'],
          references: { schema: 'public', table: 'ticket', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ticketMessage',
        foreignKey: {
          name: 'ticketMessage_senderId_fkey',
          columns: ['senderId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
