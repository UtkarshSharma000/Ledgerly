import { useState, useEffect } from 'react';
import { Plus, Search, IndianRupee, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSale, setNewSale] = useState({ product: '', qty: 1, total: '', method: 'UPI' });

  useEffect(() => {
    fetch('/api/sales')
      .then(res => res.json())
      .then(d => {
        setSales(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load sales data", err);
        setLoading(false);
      });
  }, []);

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        product: newSale.product, 
        qty: parseInt(newSale.qty as any), 
        total: parseFloat(newSale.total), 
        method: newSale.method, 
        status: 'Completed' 
      })
    })
    .then(res => res.json())
    .then(data => {
      setSales([data, ...sales]);
      setIsModalOpen(false);
      setNewSale({ product: '', qty: 1, total: '', method: 'UPI' });
    });
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
                <h3 className="font-semibold text-slate-900">Record New Sale</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddSale} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Product</label>
                  <input required value={newSale.product} onChange={e => setNewSale({...newSale, product: e.target.value})} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="e.g. Milk 1L" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Quantity</label>
                    <input required min="1" value={newSale.qty} onChange={e => setNewSale({...newSale, qty: parseInt(e.target.value)})} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Total (₹)</label>
                    <input required min="0" step="0.01" value={newSale.total} onChange={e => setNewSale({...newSale, total: e.target.value})} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
                  <select value={newSale.method} onChange={e => setNewSale({...newSale, method: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Save Sale
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
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Sales Management</h1>
          <p className="text-[12px] text-slate-500 mt-1">Record and track your daily transactions.</p>
        </div>
        <motion.button 
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 text-[13px]"
        >
          <Plus className="w-4 h-4" /> Add Sale
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-[12px] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search sales by product or ID..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-shadow text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[13px] text-slate-500 font-semibold tracking-wide">
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading sales data...</td>
                </tr>
              ) : sales.map((sale, idx) => (
                <motion.tr 
                  key={sale.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: 'var(--color-slate-50)' }}
                  className="transition-colors border-b border-slate-50 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{sale.id}</td>
                  <td className="px-4 py-3">{new Date(sale.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{sale.product}</td>
                  <td className="px-4 py-3 text-slate-500">{sale.qty}</td>
                  <td className="px-4 py-3 font-semibold flex items-center">
                    <IndianRupee className="w-3 h-3 text-slate-400 mr-0.5" />
                    {sale.total.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-[4px] text-[10px] font-semibold tracking-wider uppercase">
                      {sale.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2.5 py-0.5 bg-[#DCFCE7] text-[#166534] rounded-full text-[11px] font-semibold">
                      {sale.status}
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
