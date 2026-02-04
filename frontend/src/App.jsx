import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/authStore';
import { useUIStore } from './stores/uiStore';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { PublicRoute } from './components/layout/PublicRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddTransactionModal } from './components/transactions/AddTransactionModal';
import { Loader2 } from 'lucide-react';

// Lazy loaded pages (Decision 12)
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage'));
const AccountsPage = lazy(() => import('./pages/AccountsPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );
}

function App() {
  const { checkAuth, isInitialized } = useAuthStore();
  const { initTheme } = useUIStore();

  // Initialize auth and theme on app load
  useEffect(() => {
    initTheme();
    checkAuth();
  }, [initTheme, checkAuth]);

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        theme="dark"
      />

      {/* Global Modals */}
      <AddTransactionModal />

      <Routes>
        {/* Landing page - accessible to everyone */}
        <Route path="/" element={<LandingPage />} />

        {/* Public routes - redirect to dashboard if logged in */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route index element={<Navigate to="/app/dashboard" replace />} />

          {/* Eager loaded */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Lazy loaded */}
          <Route
            path="transactions"
            element={
              <Suspense fallback={<PageLoader />}>
                <TransactionsPage />
              </Suspense>
            }
          />
          <Route
            path="categories"
            element={
              <Suspense fallback={<PageLoader />}>
                <CategoriesPage />
              </Suspense>
            }
          />
          <Route
            path="budgets"
            element={
              <Suspense fallback={<PageLoader />}>
                <BudgetsPage />
              </Suspense>
            }
          />
          <Route
            path="accounts"
            element={
              <Suspense fallback={<PageLoader />}>
                <AccountsPage />
              </Suspense>
            }
          />
          <Route
            path="goals"
            element={
              <Suspense fallback={<PageLoader />}>
                <GoalsPage />
              </Suspense>
            }
          />
        </Route>

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
