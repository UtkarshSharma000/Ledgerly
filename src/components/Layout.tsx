import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, CreditCard, Users, UserCheck, PackageSearch, Menu, Bell, LockKeyhole } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'motion/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { disableGuestMode, isGuestMode } from '../guestMode';

const navItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/sales', label: 'Sales', icon: ReceiptText },
  { path: '/app/expenses', label: 'Expenses', icon: CreditCard },
  { path: '/app/udhaar', label: 'Udhaar (Credit)', icon: UserCheck },
  { path: '/app/customers', label: 'Customers & Proof', icon: Users },
  { path: '/app/inventory', label: 'Inventory', icon: PackageSearch },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const guestMode = isGuestMode();

  const leaveGuestMode = () => {
    disableGuestMode();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[220px] bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2.5 px-6 py-6 border-b border-transparent">
          <Link to="/" className="flex items-center gap-2.5 text-[20px] font-extrabold text-slate-900">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black">L</div>
            Ledgerly
          </Link>
        </div>
        <nav className="flex-1 flex flex-col py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-3 my-1 rounded-lg text-[14px] font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-6 shrink-0">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            {guestMode && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-[12px] font-semibold text-amber-700 ring-1 ring-amber-200">
                <LockKeyhole className="h-3.5 w-3.5" />
                Guest: 5 records per section
              </span>
            )}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 relative"
            >
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              <Bell className="w-5 h-5" />
            </motion.button>
            <SignedOut>
              {guestMode ? (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-[13px]">
                      Sign In
                    </button>
                  </SignInButton>
                  <button
                    onClick={leaveGuestMode}
                    className="px-3 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-700"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-[13px]">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
            </SignedIn>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-6 relative">
          {guestMode && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Guest mode uses browser-only data and is capped at 5 sales, 5 expenses, 5 customers, 5 udhaar records, and 5 inventory items. Sign in to save real business records.
            </div>
          )}
          <div key={location.pathname} className="min-h-full animate-route-fade">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
