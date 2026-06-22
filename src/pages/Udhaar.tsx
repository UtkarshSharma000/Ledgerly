import React, { useState, useEffect } from 'react';
import { Search, IndianRupee, BellRing, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Udhaar() {
  const [udhaar, setUdhaar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', amountOwed: '' });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const fetchUdhaar = () => {
    fetch('/api/udhaar')
      .then(res => res.json())
      .then(d => {
        setUdhaar(d);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchUdhaar();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/udhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: newCustomer.name, 
        phone: newCustomer.phone, 
        amountOwed: parseFloat(newCustomer.amountOwed), 
        status: 'Unpaid', 
        lastPurchase: new Date().toISOString(),
        lastPayment: new Date().toISOString()
      })
    })
    .then(res => res.json())
    .then(data => {
      setUdhaar([...udhaar, data]);
      setIsCustomerModalOpen(false);
      setNewCustomer({ name: '', phone: '', amountOwed: '' });
    });
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/udhaar/${selectedCustomer.id}/payment`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentAmount: parseFloat(paymentAmount) })
    })
    .then(res => res.json())
    .then(() => {
      fetchUdhaar();
      setIsPaymentModalOpen(false);
      setSelectedCustomer(null);
      setPaymentAmount('');
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Settled': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Unpaid': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Good': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AnimatePresence>
        {isCustomerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-900">New Customer</h3>
                <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddCustomer} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Customer Name</label>
                  <input required value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} type="text" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <input required value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} type="tel" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Initial Udhaar Amount (₹)</label>
                  <input required min="0" step="0.01" value={newCustomer.amountOwed} onChange={e => setNewCustomer({...newCustomer, amountOwed: e.target.value})} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Add Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isPaymentModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-semibold text-slate-900">Record Payment - {selectedCustomer.name}</h3>
                <button onClick={() => { setIsPaymentModalOpen(false); setSelectedCustomer(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleRecordPayment} className="p-5 space-y-4">
                <div>
                   <p className="text-sm text-slate-600 mb-4">Pending Udhaar: <strong className="text-slate-900 font-semibold text-lg">₹{selectedCustomer.amountOwed.toLocaleString('en-IN')}</strong></p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Amount (₹)</label>
                  <input required min="0" max={selectedCustomer.amountOwed} step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Save Payment
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
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Udhaar (Customer Credit)</h1>
          <p className="text-[12px] text-slate-500 mt-1">Manage outstanding balances and send reminders.</p>
        </div>
        <motion.button 
          onClick={() => setIsCustomerModalOpen(true)}
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
                  <p className="text-slate-500 text-xs mb-0.5">Last Purchase</p>
                  <p className="font-medium text-slate-900">{customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs mb-0.5">Last Payment</p>
                  <p className="font-medium text-slate-900">{customer.lastPayment ? new Date(customer.lastPayment).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-5 pt-5 border-t border-slate-100">
              <button onClick={() => { setSelectedCustomer(customer); setIsPaymentModalOpen(true); }} className="flex-1 bg-white border border-slate-200 text-slate-700 font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors text-sm">
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
