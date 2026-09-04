import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './features/dashboard/Dashboard';
import { InvoiceList } from './features/invoices/components/InvoiceList';
import { InvoiceDetails } from './features/invoices/components/InvoiceDetails';
import { AuthProvider } from './context/AuthProvider.tsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/:id" element={<InvoiceDetails />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
