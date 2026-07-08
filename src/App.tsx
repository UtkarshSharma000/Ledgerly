import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Expenses from './pages/Expenses';
import Udhaar from './pages/Udhaar';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Landing from './pages/Landing';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}>
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
