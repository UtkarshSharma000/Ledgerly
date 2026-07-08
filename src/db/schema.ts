import { pgTable, serial, text, integer, timestamp, doublePrecision, boolean } from 'drizzle-orm/pg-core';

export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  date: timestamp('date').defaultNow().notNull(),
  product: text('product').notNull(),
  qty: integer('qty').notNull(),
  total: doublePrecision('total').notNull(),
  method: text('method').notNull(),
  status: text('status').notNull(),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  date: timestamp('date').defaultNow().notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  method: text('method').notNull(),
  amount: doublePrecision('amount').notNull(),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  amountOwed: doublePrecision('amount_owed').default(0).notNull(),
  status: text('status').notNull(),
  lastPurchase: timestamp('last_purchase'),
  lastPayment: timestamp('last_payment'),
  address: text('address'),
  profilePhotoUrl: text('profile_photo_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const udhaarEntries = pgTable('udhaar_entries', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  amount: doublePrecision('amount').notNull(),
  reason: text('reason').notNull(),
  dueDate: timestamp('due_date'),
  status: text('status').default('pending').notNull(), // pending/paid/partial
  verificationPhotoUrl: text('verification_photo_url').notNull(),
  photoVerified: boolean('photo_verified').default(true).notNull(),
  verifiedAt: timestamp('verified_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  udhaarEntryId: integer('udhaar_entry_id').references(() => udhaarEntries.id),
  amount: doublePrecision('amount').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paidAt: timestamp('paid_at').defaultNow().notNull(),
  notes: text('notes'),
});

export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku').notNull(),
  category: text('category').notNull(),
  price: doublePrecision('price').notNull(),
  stock: integer('stock').notNull(),
  minStock: integer('min_stock').notNull(),
  status: text('status').notNull(),
});
