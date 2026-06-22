// Seed data for Ledgerly

export const dashboardStats = {
  todaySales: 15420,
  todayExpenses: 4200,
  netProfit: 11220,
  outstandingUdhaar: 45600,
  cashBalance: 8450,
  digitalBalance: 32500,
  monthlyGrowth: 12.4
};

export const revenueTrends = [
  { name: 'Mon', revenue: 14000, expenses: 3000 },
  { name: 'Tue', revenue: 12500, expenses: 2500 },
  { name: 'Wed', revenue: 16000, expenses: 8000 },
  { name: 'Thu', revenue: 15420, expenses: 4200 },
  { name: 'Fri', revenue: 18000, expenses: 5000 },
  { name: 'Sat', revenue: 22000, expenses: 4000 },
  { name: 'Sun', revenue: 20000, expenses: 3500 },
];

export const recentTransactions = [
  { id: 'TRX-1092', desc: 'Suresh Kirana Purchase', amount: 450, type: 'credit', method: 'UPI', time: '10:42 AM' },
  { id: 'TRX-1091', desc: 'Wholesale Dairy Stock', amount: -2100, type: 'debit', method: 'Bank Transfer', time: '09:15 AM' },
  { id: 'TRX-1090', desc: 'Walk-in Customer', amount: 120, type: 'credit', method: 'Cash', time: '09:05 AM' },
  { id: 'TRX-1089', desc: 'Ramesh Udhaar Payment', amount: 1500, type: 'credit', method: 'Cash', time: '08:30 AM' },
];

export const salesData = [
  { id: 'SALE-101', date: '2023-11-24', product: 'Premium Rice 25kg', qty: 2, price: 1250, total: 2500, method: 'UPI', status: 'Completed' },
  { id: 'SALE-102', date: '2023-11-24', product: 'Fortune Sunlite 5L', qty: 1, price: 650, total: 650, method: 'Card', status: 'Completed' },
  { id: 'SALE-103', date: '2023-11-23', product: 'Assorted Groceries', qty: 1, price: 840, total: 840, method: 'Cash', status: 'Completed' },
  { id: 'SALE-104', date: '2023-11-23', product: 'Aashirvaad Atta 10kg', qty: 3, price: 420, total: 1260, method: 'UPI', status: 'Completed' },
  { id: 'SALE-105', date: '2023-11-22', product: 'Tea & Snacks Catering', qty: 1, price: 4500, total: 4500, method: 'Bank Transfer', status: 'Completed' },
];

export const expensesData = [
  { id: 'EXP-501', date: '2023-11-24', category: 'Inventory', description: 'Fresh Produce Restock', amount: 3200, method: 'UPI' },
  { id: 'EXP-502', date: '2023-11-23', category: 'Utilities', description: 'Electricity Bill', amount: 1450, method: 'Card' },
  { id: 'EXP-503', date: '2023-11-20', category: 'Wages', description: 'Rahul Salary Advance', amount: 5000, method: 'Cash' },
  { id: 'EXP-504', date: '2023-11-18', category: 'Rent', description: 'Shop Rent - Nov', amount: 12000, method: 'Bank Transfer' },
];

export const udhaarData = [
  { id: 'CUST-01', name: 'Rakesh Sharma', phone: '+91 98765 43210', amountOwed: 4500, dueDate: '2023-11-30', status: 'Warning', lastPayment: '2023-10-15' },
  { id: 'CUST-02', name: 'Priya Patel', phone: '+91 98765 43211', amountOwed: 1200, dueDate: '2023-12-05', status: 'Good', lastPayment: '2023-11-20' },
  { id: 'CUST-03', name: 'Local Tea Stall', phone: '+91 98765 43212', amountOwed: 8400, dueDate: '2023-11-15', status: 'Overdue', lastPayment: '2023-09-01' },
];

export const inventoryData = [
  { id: 'PROD-01', name: 'Premium Sona Masuri Rice', sku: 'GRO-R-01', category: 'Grains', price: 1250, stock: 42, minStock: 20, status: 'In Stock' },
  { id: 'PROD-02', name: 'Aashirvaad Atta 10kg', sku: 'GRO-A-02', category: 'Grains', price: 420, stock: 15, minStock: 25, status: 'Low Stock' },
  { id: 'PROD-03', name: 'Fortune Sunflower Oil 5L', sku: 'GRO-O-03', category: 'Oils', price: 650, stock: 8, minStock: 10, status: 'Low Stock' },
  { id: 'PROD-04', name: 'Tata Salt 1kg', sku: 'GRO-S-04', category: 'Spices', price: 24, stock: 120, minStock: 50, status: 'In Stock' },
  { id: 'PROD-05', name: 'Maggi 2-Min Noodles 12-pack', sku: 'GRO-M-05', category: 'Snacks', price: 140, stock: 0, minStock: 30, status: 'Out of Stock' },
];
