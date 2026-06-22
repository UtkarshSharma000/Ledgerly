import { useState, useEffect } from 'react';
import { Search, IndianRupee, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', sku: '', category: 'Grocery', price: '', stock: 10, minStock: 5 });

  useEffect(() => {
    fetch('/api/inventory')
      .then(res => res.json())
      .then(d => {
        setInventory(d);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: newItem.name, 
        sku: newItem.sku, 
        category: newItem.category, 
        price: parseFloat(newItem.price), 
        stock: parseInt(newItem.stock as any), 
        minStock: parseInt(newItem.minStock as any),
        status: parseInt(newItem.stock as any) === 0 ? 'Out of Stock' : (parseInt(newItem.stock as any) <= parseInt(newItem.minStock as any) ? 'Low Stock' : 'In Stock')
      })
    })
    .then(res => res.json())
    .then(data => {
      setInventory([...inventory, data]);
      setIsModalOpen(false);
      setNewItem({ name: '', sku: '', category: 'Grocery', price: '', stock: 10, minStock: 5 });
    });
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'In Stock': return 'bg-emerald-50 text-emerald-700';
      case 'Low Stock': return 'bg-amber-50 text-amber-700';
      case 'Out of Stock': return 'bg-rose-50 text-rose-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-900">Add New Product</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Product Name</label>
                  <input required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="e.g. Rice 1kg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">SKU</label>
                    <input required value={newItem.sku} onChange={e => setNewItem({...newItem, sku: e.target.value})} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="e.g. SKU123" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                      <option value="Grocery">Grocery</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Price</label>
                     <input required min="0" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Stock</label>
                     <input required min="0" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-slate-700 mb-1">Min Stock</label>
                     <input required min="0" value={newItem.minStock} onChange={e => setNewItem({...newItem, minStock: parseInt(e.target.value)})} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-[12px] text-slate-500 mt-1">Monitor stock levels and product catalog.</p>
        </div>
        <motion.button 
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 text-[13px]"
        >
          <Plus className="w-4 h-4" /> Add Product
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-[12px] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[13px] text-slate-500 font-semibold tracking-wide">
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price / Unit</th>
                <th className="px-4 py-3">In Stock</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading inventory...</td>
                </tr>
              ) : inventory.map((item, idx) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: 'var(--color-slate-50)' }}
                  className="transition-colors border-b border-slate-50 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{item.sku}</td>
                  <td className="px-4 py-3 text-slate-600">{item.category}</td>
                  <td className="px-4 py-3 flex items-center">
                    <IndianRupee className="w-3 h-3 text-slate-400 mr-0.5" />{item.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold ${item.stock <= item.minStock ? 'text-rose-600' : 'text-slate-900'}`}>
                        {item.stock}
                      </span>
                      <span className="text-[11px] text-slate-400">/ min {item.minStock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-semibold tracking-wider uppercase ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
