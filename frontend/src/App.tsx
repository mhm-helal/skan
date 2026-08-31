import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store';
import Navbar from './components/Navbar';
import DockNav from './components/DockNav';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SetupPage = lazy(() => import('./pages/SetupPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));

function AppContent() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen pb-24">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/setup" element={<SetupPage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <DockNav />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
