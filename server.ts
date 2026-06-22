import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.js";
import { sales, expenses, customers, inventory } from "./src/db/schema.js";
import { desc, sql, eq } from "drizzle-orm";
import { 
  dashboardStats, 
  salesData, 
  expensesData, 
  udhaarData, 
  inventoryData, 
  revenueTrends,
  recentTransactions
} from "./src/mocks/db.js";

async function startServer() {
  const app = express();
  
  // Use port from CLI arguments if provided, else default to 3000 to satisfy platform constraints
  const portArg = process.argv.slice(2).find(arg => /^\d+$/.test(arg));
  const PORT = portArg ? parseInt(portArg, 10) : 3000;

  app.use(express.json());

  // --- API Routes ---
  
  // Dashboard
  app.get("/api/dashboard", async (req, res) => {
    if (!db) {
      return res.json({ stats: dashboardStats, revenueTrends, recentTransactions });
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
        revenueTrends: dailySales.length > 0 ? dailySales : revenueTrends, // Fallback if no data
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
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Sales
  app.get("/api/sales", async (req, res) => {
    if (!db) return res.json(salesData);
    try {
      const data = await db.select().from(sales).orderBy(desc(sales.date)).limit(50);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });
  
  app.post("/api/sales", async (req, res) => {
    if (!db) {
      const newSale = { id: `SALE-${Date.now()}`, date: new Date().toISOString().split('T')[0], ...req.body };
      salesData.unshift(newSale);
      return res.status(201).json(newSale);
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
    if (!db) return res.json(expensesData);
    try {
      const data = await db.select().from(expenses).orderBy(desc(expenses.date)).limit(50);
      res.json(data);
    } catch (err) {
       res.status(500).json({ error: (err as any).message });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    if (!db) {
      const newExpense = { id: `EXP-${Date.now()}`, date: new Date().toISOString().split('T')[0], ...req.body };
      expensesData.unshift(newExpense);
      return res.status(201).json(newExpense);
    }
    try {
      const newExpense = await db.insert(expenses).values(req.body).returning();
      res.status(201).json(newExpense[0]);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  // Udhaar (Debts)
  app.get("/api/udhaar", async (req, res) => {
    if (!db) return res.json(udhaarData);
    try {
      const data = await db.select().from(customers);
      res.json(data);
    } catch (err) {
       res.status(500).json({ error: (err as any).message });
    }
  });

  app.post("/api/udhaar", async (req, res) => {
    if (!db) {
      const newCustomer = { id: `CUST-${Date.now()}`, lastPurchase: new Date().toISOString().split('T')[0], ...req.body };
      udhaarData.push(newCustomer);
      return res.status(201).json(newCustomer);
    }
    try {
      const newCustomer = await db.insert(customers).values(req.body).returning();
      res.status(201).json(newCustomer[0]);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  app.put("/api/udhaar/:id/payment", async (req, res) => {
    if (!db) return res.json({ success: true });
    try {
      const { paymentAmount } = req.body;
      const [customer] = await db.select().from(customers).where(eq(customers.id, parseInt(req.params.id)));
      if (!customer) return res.status(404).json({ error: "Customer not found" });

      const newAmount = Math.max(0, customer.amountOwed - paymentAmount);
      const updated = await db.update(customers)
        .set({ 
          amountOwed: newAmount, 
          status: newAmount === 0 ? 'Settled' : 'Unpaid',
          lastPayment: new Date()
        })
        .where(eq(customers.id, parseInt(req.params.id)))
        .returning();
      res.json(updated[0]);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  // Inventory
  app.get("/api/inventory", async (req, res) => {
    if (!db) return res.json(inventoryData);
    try {
      const data = await db.select().from(inventory);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: (err as any).message });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    if (!db) {
      const newItem = { id: `ITEM-${Date.now()}`, ...req.body };
      inventoryData.push(newItem);
      return res.status(201).json(newItem);
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
