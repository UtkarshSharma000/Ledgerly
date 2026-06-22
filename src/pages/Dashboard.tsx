import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, Wallet, CreditCard, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Stats {
  todaySales: number;
  todayExpenses: number;
  netProfit: number;
  outstandingUdhaar: number;
  cashBalance: number;
  digitalBalance: number;
  monthlyGrowth: number;
}

interface DashboardData {
  stats: Stats;
  revenueTrends: any[];
  recentTransactions: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load dashboard data", err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const KPICard = ({ title, amount, icon: Icon, trend, isPositive, bgClass = "bg-white", delay = 0 }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      className={`p-4 rounded-[12px] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${bgClass} transition-shadow`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500 mb-1">{title}</p>
          <h3 className="text-[24px] font-bold text-slate-900 flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-slate-400" />
            {amount.toLocaleString('en-IN')}
          </h3>
        </div>
        <div className="p-2 rounded-lg bg-slate-50">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
      </div>
      {trend && (
        <div className={`mt-1 flex items-center text-[11px] font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? '↑' : '↓'} {trend}% vs yesterday
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Ganesha Kirana & General Store</h1>
        <div className="text-[12px] text-slate-500">
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} • Daily Close 21:00
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Today's Sales" amount={data.stats.todaySales} icon={Wallet} trend={12.5} isPositive={true} delay={0.1} />
        <KPICard title="Today's Expenses" amount={data.stats.todayExpenses} icon={CreditCard} trend={4.2} isPositive={false} delay={0.2} />
        <KPICard title="Net Profit" amount={data.stats.netProfit} icon={IndianRupee} trend={24.1} isPositive={true} bgClass="bg-emerald-50/50 border-emerald-100" delay={0.3} />
        <KPICard title="Outstanding Udhaar" amount={data.stats.outstandingUdhaar} icon={Users} trend={2.1} isPositive={false} bgClass="bg-rose-50/50 border-rose-100" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 bg-white p-4 rounded-[12px] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-bold text-slate-900">Revenue Trend (Last 7 Days)</h2>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span> Sales
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Expenses
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueTrends} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary-500)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="expenses" stroke="#cbd5e1" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white p-4 rounded-[12px] border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[14px] font-bold text-slate-900">Recent Transactions</h2>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 hover:text-primary-700"
            >
              View All
            </motion.button>
          </div>
          <div className="space-y-4 flex-1 overflow-auto">
            {data.recentTransactions.map((trx, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                whileHover={{ x: 4, backgroundColor: 'var(--color-slate-50)' }}
                className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0 transition-colors rounded-lg p-2 -mx-2"
              >
                <div className="flex gap-3 items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    trx.type === 'credit' ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEF9C3] text-[#854D0E]'
                  }`}>
                    {trx.type === 'credit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-900 line-clamp-1">{trx.desc}</p>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{trx.method} • {trx.time}</p>
                  </div>
                </div>
                <span className={`text-[13px] font-bold ${trx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {trx.type === 'credit' ? '+' : '-'}₹{Math.abs(trx.amount).toLocaleString('en-IN')}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
