import { useState, useEffect } from 'react';
import { Search, IndianRupee, BellRing, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

export default function Udhaar() {
  const [udhaar, setUdhaar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/udhaar')
      .then(res => res.json())
      .then(d => {
        setUdhaar(d);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Udhaar (Customer Credit)</h1>
          <p className="text-[12px] text-slate-500 mt-1">Manage outstanding balances and send reminders.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 text-[13px]"
        >
          <UserPlus className="w-4 h-4" /> New Customer
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {loading ? null : udhaar.map(customer => (
          <div key={customer.id} className="bg-white p-4 rounded-[12px] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-[14px]">{customer.name}</h3>
                  <p className="text-[12px] text-slate-500">{customer.phone}</p>
                </div>
                <span className={`px-2 py-0.5 border rounded-[4px] text-[10px] font-semibold tracking-wider uppercase ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1">Outstanding Balance</p>
                <div className="text-[24px] font-bold text-slate-900 flex items-center">
                  <IndianRupee className="w-5 h-5 text-slate-400 mr-1" />
                  {customer.amountOwed.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Due Date</p>
                  <p className="font-medium text-slate-900">{new Date(customer.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Last Payment</p>
                  <p className="font-medium text-slate-900">{new Date(customer.lastPayment).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-5 pt-5 border-t border-slate-100">
              <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                Record Payment
              </button>
              <button className="flex items-center justify-center gap-2 flex-1 bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                <BellRing className="w-4 h-4" /> Reminder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
