import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
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
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---
  
  // Dashboard
  app.get("/api/dashboard", (req, res) => {
    res.json({
      stats: dashboardStats,
      revenueTrends,
      recentTransactions
    });
  });

  // Sales
  app.get("/api/sales", (req, res) => {
    res.json(salesData);
  });
  app.post("/api/sales", (req, res) => {
    const newSale = { id: `SALE-${Date.now()}`, date: new Date().toISOString().split('T')[0], ...req.body };
    salesData.unshift(newSale);
    res.status(201).json(newSale);
  });

  // Expenses
  app.get("/api/expenses", (req, res) => {
    res.json(expensesData);
  });

  // Udhaar (Debts)
  app.get("/api/udhaar", (req, res) => {
    res.json(udhaarData);
  });

  // Inventory
  app.get("/api/inventory", (req, res) => {
    res.json(inventoryData);
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
