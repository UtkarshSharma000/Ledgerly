import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Udhaar from './pages/Udhaar';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Landing from './pages/Landing';
import { enableGuestMode, isGuestMode } from './guestMode';

function RequireAuth({ children }: { children: ReactNode }) {
  const [guestMode] = useState(isGuestMode);

  if (guestMode) {
    return children;
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl="/app/dashboard" />
      </SignedOut>
    </>
  );
}

function StartGuestMode() {
  enableGuestMode();
  return <Navigate to="/app/dashboard" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/guest/start" element={<StartGuestMode />} />
        <Route path="/app" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="udhaar" element={<Udhaar />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </Router>
  );
}
