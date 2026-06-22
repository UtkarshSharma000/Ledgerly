import { pgTable, serial, text, integer, timestamp, doublePrecision } from 'drizzle-orm/pg-core';

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
