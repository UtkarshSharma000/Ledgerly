import { useState, useEffect } from 'react';
import { Plus, Search, IndianRupee, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
