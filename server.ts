import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.js";
import { sales, expenses, customers, inventory, udhaarEntries, payments } from "./src/db/schema.js";
import { desc, sql, eq } from "drizzle-orm";
import { 
  salesData, 
  expensesData, 
  udhaarData, 
  inventoryData
} from "./src/mocks/db.js";

const emptyDashboardData = {
  stats: {
    todaySales: 0,
    todayExpenses: 0,
    netProfit: 0,
    outstandingUdhaar: 0,
    cashBalance: 0,
    digitalBalance: 0,
    monthlyGrowth: 0
  },
  revenueTrends: [],
  recentTransactions: []
};

function missingDatabase(res: express.Response) {
  return res.status(503).json({
    error: "Database is not configured. Connect DATABASE_URL to store real Ledgerly data."
  });
}

async function startServer() {
  const app = express();
  
  // Use port from CLI arguments if provided, else default to 3000 to satisfy platform constraints
  const portArg = process.argv.slice(2).find(arg => /^\d+$/.test(arg));
  const PORT = portArg ? parseInt(portArg, 10) : 3000;

  app.use(express.json());

  // Seed Database if empty
  async function seedDatabaseIfEmpty() {
    if (!db) return;
    try {
      const existingSales = await db.select().from(sales).limit(1);
      if (existingSales.length === 0) {
        console.log("Seeding database tables...");
        
        // Seed Sales
        for (const s of salesData) {
          try {
            await db.insert(sales).values({
              product: s.product,
              qty: s.qty,
              total: s.total,
              method: s.method,
              status: s.status,
              date: new Date(s.date)
            });
          } catch (e) {
            console.error("Error inserting sale:", e);
          }
        }
        
        // Seed Expenses
        for (const e of expensesData) {
          try {
            await db.insert(expenses).values({
              description: e.description,
              category: e.category,
              method: e.method,
              amount: e.amount,
              date: new Date(e.date)
            });
          } catch (err) {
            console.error("Error inserting expense:", err);
          }
        }
        
        // Seed Customers
        for (const c of udhaarData) {
          try {
            await db.insert(customers).values({
              name: c.name,
              phone: c.phone,
              amountOwed: c.amountOwed,
              status: c.status,
              lastPurchase: c.dueDate ? new Date(c.dueDate) : null,
              lastPayment: c.lastPayment ? new Date(c.lastPayment) : null
            });
          } catch (err) {
            console.error("Error inserting customer:", err);
          }
        }
        
        // Seed Inventory
        for (const i of inventoryData) {
          try {
            await db.insert(inventory).values({
              name: i.name,
              sku: i.sku,
              category: i.category,
              price: i.price,
              stock: i.stock,
              minStock: i.minStock,
              status: i.status
            });
          } catch (err) {
            console.error("Error inserting inventory item:", err);
          }
        }
        console.log("Database tables seeded successfully!");
      }
    } catch (err) {
      console.error("Error seeding database:", err);
    }
  }

  if (db && process.env.SEED_DEMO_DATA === "true") {
    await seedDatabaseIfEmpty();
  }

  // --- API Routes ---
  
  // Dashboard
  app.get("/api/dashboard", async (req, res) => {
    if (!db) {
      return res.json(emptyDashboardData);
    }
    try {
      const [todaySales] = await db.select({ total: sql`sum(${sales.total})` }).from(sales);
      const [todayExpenses] = await db.select({ total: sql`sum(${expenses.amount})` }).from(expenses);
      const [outstandingUdhaar] = await db.select({ total: sql`sum(${customers.amountOwed})` }).from(customers);
      
      const recentTrxSales = await db.select({ id: sales.id, amount: sales.total, desc: sales.product, method: sales.method, date: sales.date })
        .from(sales).orderBy(desc(sales.date)).limit(5);

      // Last 7 days revenue trend
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const dailySales = await db.select({
        day: sql<string>`to_char(${sales.date}, 'Mon DD')`,
        revenue: sql<number>`sum(${sales.total})`,
      })
      .from(sales)
      .where(sql`${sales.date} >= ${sevenDaysAgo}`)
      .groupBy(sql`to_char(${sales.date}, 'Mon DD')`)
      .orderBy(sql`min(${sales.date})`);
        
      res.json({
        stats: {
          todaySales: todaySales?.total || 0,
          todayExpenses: todayExpenses?.total || 0,
          netProfit: (todaySales?.total || 0) - (todayExpenses?.total || 0),
          outstandingUdhaar: outstandingUdhaar?.total || 0
        },
        revenueTrends: dailySales,
        recentTransactions: recentTrxSales.map(t => ({
          type: 'credit',
          amount: t.amount,
          desc: t.desc,
          method: t.method,
          time: new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: (err as any).message });
    }
  });

  // Sales
  app.get("/api/sales", async (req, res) => {
    if (!db) return res.json([]);
    try {
      const data = await db.select().from(sales).orderBy(desc(sales.date)).limit(50);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });
  
  app.post("/api/sales", async (req, res) => {
    if (!db) {
      return missingDatabase(res);
    }
    try {
      const newSale = await db.insert(sales).values(req.body).returning();
      res.status(201).json(newSale[0]);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  // Expenses
  app.get("/api/expenses", async (req, res) => {
    if (!db) return res.json([]);
    try {
      const data = await db.select().from(expenses).orderBy(desc(expenses.date)).limit(50);
      res.json(data);
    } catch (err) {
       res.status(500).json({ error: (err as any).message });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    if (!db) {
      return missingDatabase(res);
    }
    try {
      const newExpense = await db.insert(expenses).values(req.body).returning();
      res.status(201).json(newExpense[0]);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  // Customers Page Endpoints
  app.get("/api/customers", async (req, res) => {
    if (!db) {
      return res.json([]);
    }
    try {
      const allCustomers = await db.select().from(customers);
      const allEntries = await db.select().from(udhaarEntries);
      const allPayments = await db.select().from(payments);

      const result = allCustomers.map(c => {
        const cEntries = allEntries.filter(e => e.customerId === c.id);
        const cPayments = allPayments.filter(p => p.customerId === c.id);

        const totalUdhaar = cEntries.reduce((sum, e) => sum + e.amount, 0);
        const paidAmount = cPayments.reduce((sum, p) => sum + p.amount, 0);
        
        const pendingAmount = cEntries.length > 0 ? Math.max(0, totalUdhaar - paidAmount) : c.amountOwed;

        let status = 'Good';
        if (pendingAmount > 5000) {
          status = 'Warning';
        }
        if (pendingAmount > 10000) {
          status = 'Overdue';
        }
        if (pendingAmount === 0) {
          status = 'Settled';
        }

        return {
          ...c,
          totalUdhaar,
          paidAmount,
          pendingAmount,
          status,
          entriesCount: cEntries.length,
          paymentsCount: cPayments.length,
        };
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  app.post("/api/customers", async (req, res) => {
    if (!db) {
      return missingDatabase(res);
    }
    try {
      const { name, phone, address, profilePhotoUrl, notes } = req.body;
      const [newCust] = await db.insert(customers).values({
        name,
        phone,
        address: address || "",
        profilePhotoUrl: profilePhotoUrl || "",
        notes: notes || "",
        amountOwed: 0,
        status: 'Good',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      res.status(201).json(newCust);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    const custId = parseInt(req.params.id);
    if (!db) {
      return missingDatabase(res);
    }
    try {
      const [customer] = await db.select().from(customers).where(eq(customers.id, custId));
      if (!customer) return res.status(404).json({ error: "Customer not found" });

      const entries = await db.select().from(udhaarEntries).where(eq(udhaarEntries.customerId, custId));
      const payList = await db.select().from(payments).where(eq(payments.customerId, custId));

      const totalUdhaar = entries.reduce((sum, e) => sum + e.amount, 0);
      const paidAmount = payList.reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = entries.length > 0 ? Math.max(0, totalUdhaar - paidAmount) : customer.amountOwed;

      const history: any[] = [];
      entries.forEach(e => {
        history.push({
          id: `udhaar-${e.id}`,
          type: 'udhaar',
          amount: e.amount,
          description: e.reason,
          date: e.createdAt,
          dueDate: e.dueDate,
          photoVerified: e.photoVerified,
          verificationPhotoUrl: e.verificationPhotoUrl,
          verifiedAt: e.verifiedAt,
          status: e.status
        });
      });

      payList.forEach(p => {
        history.push({
          id: `payment-${p.id}`,
          type: 'payment',
          amount: p.amount,
          description: `Payment received (${p.paymentMethod})${p.notes ? ' - ' + p.notes : ''}`,
          date: p.paidAt,
        });
      });

      history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      res.json({
        customer,
        totalUdhaar,
        paidAmount,
        pendingAmount,
        history
      });
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  // Udhaar (Debts) - returning custom/aggregated metrics
  app.get("/api/udhaar", async (req, res) => {
    if (!db) return res.json([]);
    try {
      const allCustomers = await db.select().from(customers);
      const allEntries = await db.select().from(udhaarEntries);
      const allPayments = await db.select().from(payments);

      const result = allCustomers.map(c => {
        const cEntries = allEntries.filter(e => e.customerId === c.id);
        const cPayments = allPayments.filter(p => p.customerId === c.id);

        const totalUdhaar = cEntries.reduce((sum, e) => sum + e.amount, 0);
        const paidAmount = cPayments.reduce((sum, p) => sum + p.amount, 0);
        const pendingAmount = cEntries.length > 0 ? Math.max(0, totalUdhaar - paidAmount) : c.amountOwed;

        let status = c.status;
        if (cEntries.length > 0) {
          if (pendingAmount > 10000) status = 'Overdue';
          else if (pendingAmount > 5000) status = 'Warning';
          else if (pendingAmount === 0) status = 'Settled';
          else status = 'Unpaid';
        }

        return {
          ...c,
          amountOwed: pendingAmount,
          status: status
        };
      });
      res.json(result);
    } catch (err) {
       res.status(500).json({ error: (err as any).message });
    }
  });

  app.post("/api/udhaar", async (req, res) => {
    if (!db) {
      return missingDatabase(res);
    }
    try {
      const { customerId, amount, reason, dueDate, verificationPhotoUrl } = req.body;
      
      if (customerId) {
        const parsedCustId = parseInt(customerId);
        const [customerRec] = await db.select().from(customers).where(eq(customers.id, parsedCustId));
        if (!customerRec) return res.status(404).json({ error: "Customer not found" });

        const [newEntry] = await db.insert(udhaarEntries).values({
          customerId: parsedCustId,
          amount: parseFloat(amount),
          reason: reason || "General Purchase",
          dueDate: dueDate ? new Date(dueDate) : null,
          status: 'pending',
          verificationPhotoUrl: verificationPhotoUrl || "",
          photoVerified: !!verificationPhotoUrl,
          verifiedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        const updatedOwed = customerRec.amountOwed + parseFloat(amount);
        await db.update(customers)
          .set({
            amountOwed: updatedOwed,
            status: updatedOwed > 10000 ? 'Overdue' : 'Unpaid',
            lastPurchase: new Date(),
            updatedAt: new Date()
          })
          .where(eq(customers.id, parsedCustId));

        res.status(201).json(newEntry);
      } else {
        const { name, phone, amountOwed, status, lastPurchase, lastPayment } = req.body;
        const [newCust] = await db.insert(customers).values({
          name,
          phone,
          amountOwed: parseFloat(amountOwed) || 0,
          status: status || 'Unpaid',
          lastPurchase: lastPurchase ? new Date(lastPurchase) : new Date(),
          lastPayment: lastPayment ? new Date(lastPayment) : null,
          createdAt: new Date(),
          updatedAt: new Date()
        }).returning();

        const initialAmt = parseFloat(amountOwed) || 0;
        if (initialAmt > 0) {
          await db.insert(udhaarEntries).values({
            customerId: newCust.id,
            amount: initialAmt,
            reason: "Initial Balance",
            status: 'pending',
            verificationPhotoUrl: "",
            photoVerified: false,
            verifiedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        res.status(201).json(newCust);
      }
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  app.post("/api/payments", async (req, res) => {
    if (!db) {
      return missingDatabase(res);
    }
    try {
      const { customerId, amount, paymentMethod, notes, udhaarEntryId } = req.body;
      const parsedCustId = parseInt(customerId);
      const parsedAmount = parseFloat(amount);

      const [customerRec] = await db.select().from(customers).where(eq(customers.id, parsedCustId));
      if (!customerRec) return res.status(404).json({ error: "Customer not found" });

      const [newPayment] = await db.insert(payments).values({
        customerId: parsedCustId,
        udhaarEntryId: udhaarEntryId ? parseInt(udhaarEntryId) : null,
        amount: parsedAmount,
        paymentMethod: paymentMethod || "Cash",
        paidAt: new Date(),
        notes: notes || "",
      }).returning();

      const entries = await db.select().from(udhaarEntries)
        .where(eq(udhaarEntries.customerId, parsedCustId))
        .orderBy(udhaarEntries.createdAt);

      let remainingPayment = parsedAmount;
      for (const entry of entries) {
        if (remainingPayment <= 0) break;

        if (entry.status === 'pending' || entry.status === 'partial') {
          const entryOwed = entry.amount;
          if (remainingPayment >= entryOwed) {
            remainingPayment -= entryOwed;
            await db.update(udhaarEntries)
              .set({ status: 'paid', updatedAt: new Date() })
              .where(eq(udhaarEntries.id, entry.id));
          } else {
            await db.update(udhaarEntries)
              .set({ status: 'partial', updatedAt: new Date() })
              .where(eq(udhaarEntries.id, entry.id));
            remainingPayment = 0;
          }
        }
      }

      const newOwed = Math.max(0, customerRec.amountOwed - parsedAmount);
      await db.update(customers)
        .set({
          amountOwed: newOwed,
          status: newOwed === 0 ? 'Settled' : 'Unpaid',
          lastPayment: new Date(),
          updatedAt: new Date()
        })
        .where(eq(customers.id, parsedCustId));

      res.status(201).json(newPayment);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  app.put("/api/udhaar/:id/payment", async (req, res) => {
    if (!db) return missingDatabase(res);
    try {
      const { paymentAmount } = req.body;
      const parsedCustId = parseInt(req.params.id);
      
      const [customerRec] = await db.select().from(customers).where(eq(customers.id, parsedCustId));
      if (!customerRec) return res.status(404).json({ error: "Customer not found" });

      await db.insert(payments).values({
        customerId: parsedCustId,
        amount: parseFloat(paymentAmount),
        paymentMethod: "Cash",
        paidAt: new Date(),
        notes: "Legacy Record Payment",
      });

      const newAmount = Math.max(0, customerRec.amountOwed - parseFloat(paymentAmount));
      const updated = await db.update(customers)
        .set({ 
          amountOwed: newAmount, 
          status: newAmount === 0 ? 'Settled' : 'Unpaid',
          lastPayment: new Date(),
          updatedAt: new Date()
        })
        .where(eq(customers.id, parsedCustId))
        .returning();

      res.json(updated[0]);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  // Inventory
  app.get("/api/inventory", async (req, res) => {
    if (!db) return res.json([]);
    try {
      const data = await db.select().from(inventory);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    if (!db) {
      return missingDatabase(res);
    }
    try {
      const newItem = await db.insert(inventory).values(req.body).returning();
      res.status(201).json(newItem[0]);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
