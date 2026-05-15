import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;
export type TshirtSize = (typeof TSHIRT_SIZES)[number];

export const REGISTRATION_STATUSES = ['confirmed', 'waitlist', 'cancelled'] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const REHEARSAL_STATUSES = ['confirmed', 'waitlist'] as const;
export type RehearsalStatus = (typeof REHEARSAL_STATUSES)[number];

export const REHEARSAL_DATES = ['2026-06-10', '2026-06-17', '2026-06-24'] as const;
export type RehearsalDate = (typeof REHEARSAL_DATES)[number];

export const registrations = sqliteTable(
  'registrations',
  {
    id: text('id').primaryKey(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    tshirtSize: text('tshirt_size').notNull(),
    status: text('status').notNull().default('confirmed'),
    notes: text('notes'),
    confirmationSentAt: integer('confirmation_sent_at', { mode: 'timestamp' }),
  },
  (t) => [uniqueIndex('registrations_email_unique').on(t.email)],
);

export const rehearsalSignups = sqliteTable(
  'rehearsal_signups',
  {
    id: text('id').primaryKey(),
    registrationId: text('registration_id')
      .notNull()
      .references(() => registrations.id, { onDelete: 'cascade' }),
    rehearsalDate: text('rehearsal_date').notNull(),
    status: text('status').notNull().default('confirmed'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex('rehearsal_signups_unique').on(t.registrationId, t.rehearsalDate)],
);

export const adminSessions = sqliteTable('admin_sessions', {
  token: text('token').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
export type RehearsalSignup = typeof rehearsalSignups.$inferSelect;
