import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

// Pages
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import WishlistPage from '../pages/WishlistPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AccountPage from '../pages/AccountPage';
import OrdersPage from '../pages/OrdersPage';
import OrderTrackingPage from '../pages/OrderTrackingPage';
import NotificationsPage from '../pages/NotificationsPage';
import HelpCenterPage from '../pages/HelpCenterPage';
import ComparePage from '../pages/ComparePage';
import SellerStorePage from '../pages/SellerStorePage';
import SellerDashboardPage from '../pages/SellerDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';

// Route Guard: Restrict customers from accessing Seller Dashboard
function SellerRoute({ children }) {
  const { user, loading, isSeller } = useAuth();
  
  if (loading) return null;

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in as customer or not a seller, remove access to seller dashboard
  if (!isSeller || user.role === 'customer') {
    return <Navigate to="/account" replace />;
  }

  return children;
}

// Route Guard: Restrict non-admins from Admin Dashboard
function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Marketplace Consumer Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/search" element={<ShopPage />} />
        <Route path="/category/:category" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderTrackingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        
        {/* Public Storefront */}
        <Route path="/seller/:sellerId" element={<SellerStorePage />} />

        {/* Protected Seller & Admin Routes */}
        <Route 
          path="/seller/dashboard" 
          element={
            <SellerRoute>
              <SellerDashboardPage />
            </SellerRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          } 
        />
      </Route>

      {/* Auth Routes (Standalone clean header) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
