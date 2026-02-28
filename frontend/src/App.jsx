import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SellerDashboard } from './pages/Seller';
import { Admin } from './pages/Admin';
const AdminSellerProfile = React.lazy(() =>
  import('./pages/AdminSellerProfile').then((m) => ({ default: m.AdminSellerProfile }))
);
const Search = lazy(() =>
  import('./pages/Search').then((m) => ({ default: m.Search }))
);
const ShopDetails = lazy(() =>
  import('./pages/ShopDetails').then((m) => ({ default: m.ShopDetails }))
);
const UserProfile = lazy(() =>
  import('./pages/UserProfile').then((m) => ({ default: m.UserProfile }))
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-slate-600">
              Loading...
            </div>
          }
        >
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shop/:id"
            element={
              <ProtectedRoute>
                <ShopDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller"
            element={
              <ProtectedRoute requiredRole="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Admin />} />
            <Route path="seller/:id" element={<AdminSellerProfile />} />
          </Route>

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
