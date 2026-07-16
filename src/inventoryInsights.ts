export type InventoryItem = {
  id: string | number;
  name: string;
  sku?: string;
  category?: string;
  price?: number;
  status?: string;
  stock: number;
  minStock: number;
};

export type SaleRecord = {
  product: string;
  qty: number;
  date?: string;
};

export type InventoryInsight = InventoryItem & {
  soldLast30Days: number;
  daysOfCover: number | null;
  demandSupplyRatio: number;
  recommendedRestock: number;
  priority: 'restock' | 'watch' | 'healthy';
};

function productKey(name: string) {
  return name.trim().toLocaleLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getInventoryInsights(inventory: InventoryItem[], sales: SaleRecord[]) {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const demandByProduct = new Map<string, number>();

  for (const sale of sales) {
    const saleDate = sale.date ? new Date(sale.date).getTime() : Date.now();
    if (!sale.product || Number.isNaN(saleDate) || saleDate < thirtyDaysAgo) continue;

    const key = productKey(sale.product);
    demandByProduct.set(key, (demandByProduct.get(key) || 0) + Math.max(0, Number(sale.qty) || 0));
  }

  return inventory
    .map((item): InventoryInsight => {
      const stock = Math.max(0, Number(item.stock) || 0);
      const minStock = Math.max(0, Number(item.minStock) || 0);
      const soldLast30Days = demandByProduct.get(productKey(item.name)) || 0;
      const dailyDemand = soldLast30Days / 30;
      const daysOfCover = dailyDemand > 0 ? Math.floor(stock / dailyDemand) : null;
      const demandSupplyRatio = soldLast30Days / Math.max(stock, 1);
      const targetStock = Math.max(minStock * 2, Math.ceil(dailyDemand * 14));
      const recommendedRestock = Math.max(0, targetStock - stock);
      const priority = (minStock > 0 && stock <= minStock) || (dailyDemand > 0 && (daysOfCover || 0) < 7)
        ? 'restock'
        : demandSupplyRatio >= 0.75
          ? 'watch'
          : 'healthy';

      return { ...item, stock, minStock, soldLast30Days, daysOfCover, demandSupplyRatio, recommendedRestock, priority };
    })
    .sort((a, b) => {
      const priorityOrder = { restock: 0, watch: 1, healthy: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority] || b.demandSupplyRatio - a.demandSupplyRatio;
    });
}
