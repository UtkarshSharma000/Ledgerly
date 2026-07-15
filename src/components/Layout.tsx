import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CreditCard, LayoutDashboard, LockKeyhole, Menu, PackageSearch, ReceiptText, Settings2, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { disableGuestMode, isGuestMode } from '../guestMode';
import AppearanceSettings, { getThemeStyle, type ThemeMode } from './AppearanceSettings';

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
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('ledgerly-mode') as ThemeMode) || 'light');
  const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('ledgerly-scheme') || 'linen');
  const guestMode = isGuestMode();

  useEffect(() => {
    localStorage.setItem('ledgerly-mode', themeMode);
    localStorage.setItem('ledgerly-scheme', colorScheme);
  }, [themeMode, colorScheme]);

  const leaveGuestMode = () => {
    disableGuestMode();
    navigate('/');
  };

  return (
    <div className="app-shell flex h-screen overflow-hidden font-sans" data-mode={themeMode} style={getThemeStyle(themeMode, colorScheme)}>
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[236px] flex-col border-r border-[var(--app-border)] bg-[var(--app-sidebar)] transition-transform duration-200 ease-in-out lg:static lg:inset-auto lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2.5 px-6 py-6">
          <Link to="/" className="flex items-center gap-2.5 text-[20px] font-extrabold text-[var(--app-text)]">
            <img src="/ledgerly-mark.jpg" alt="" className="h-8 w-8 rounded-md object-cover" />
            Ledgerly
          </Link>
        </div>
        <nav className="flex flex-1 flex-col py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <motion.div key={item.path} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`mx-3 my-1 flex items-center gap-3 rounded-md px-4 py-2.5 text-[14px] font-medium transition-colors ${isActive ? 'bg-[var(--accent-soft)] text-[var(--accent-strong)]' : 'text-[var(--app-muted)] hover:bg-[var(--app-hover)]'}`}>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--app-faint)]'}`} />
                  {item.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface)] px-4 sm:px-6 lg:px-8">
          <button type="button" aria-label="Open navigation" className="rounded-md p-2 text-[var(--app-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text)] lg:hidden" onClick={() => setIsMobileMenuOpen((open) => !open)}><Menu className="h-5 w-5" /></button>
          <div className="flex flex-1 items-center justify-end gap-3">
            {guestMode && <span className="hidden items-center gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-[12px] font-semibold text-amber-700 ring-1 ring-amber-200 sm:inline-flex"><LockKeyhole className="h-3.5 w-3.5" />Guest: 5 records per section</span>}
            <div className="relative">
              <button type="button" title="Appearance settings" aria-label="Open appearance settings" onClick={() => setIsAppearanceOpen((open) => !open)} className="rounded-md p-2 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-hover)] hover:text-[var(--app-text)]"><Settings2 className="h-5 w-5" /></button>
              <AppearanceSettings isOpen={isAppearanceOpen} onClose={() => setIsAppearanceOpen(false)} mode={themeMode} scheme={colorScheme} onModeChange={setThemeMode} onSchemeChange={setColorScheme} />
            </div>
            <motion.button type="button" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} title="Notifications" className="relative rounded-md p-2 text-[var(--app-muted)] hover:bg-[var(--app-hover)] hover:text-[var(--app-text)]"><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" /><Bell className="h-5 w-5" /></motion.button>
            <SignedOut>
              {guestMode ? <div className="flex items-center gap-2"><SignInButton mode="modal"><button className="rounded-md bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-strong)]">Sign in</button></SignInButton><button onClick={leaveGuestMode} className="px-2 py-2 text-[13px] font-medium text-[var(--app-muted)] hover:text-[var(--app-text)]">Exit</button></div> : <SignInButton mode="modal"><button className="rounded-md bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-strong)]">Sign in</button></SignInButton>}
            </SignedOut>
            <SignedIn><UserButton appearance={{ elements: { userButtonAvatarBox: 'w-8 h-8' } }} /></SignedIn>
          </div>
        </header>

        <main className="app-content relative flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {guestMode && <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Guest mode uses browser-only data and is capped at 5 sales, 5 expenses, 5 customers, 5 udhaar records, and 5 inventory items. Sign in to save real business records.</div>}
          <div key={location.pathname} className="min-h-full animate-route-fade"><Outlet /></div>
        </main>
      </div>
      {isMobileMenuOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
    </div>
  );
}
