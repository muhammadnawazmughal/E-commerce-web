import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Storefront Pages
import Home from '../Pages/Home';
import Products from '../Pages/Products';
import ProductDetails from '../Pages/ProductDetails';
import Categories from '../Pages/Categories';
import Cart from '../Pages/Cart';
import Checkout from '../Pages/Checkout';
import Orders from '../Pages/Orders';
import OrderDetail from '../Pages/OrderDetail';
import Account from '../Pages/Account';
import Wishlist from '../Pages/Wishlist';
import Login from '../Pages/Login';
import Register from '../Pages/Register';

// Admin Pages
import AdminDashboard from '../Pages/admin/AdminDashboard';
import AdminProducts from '../Pages/admin/AdminProducts';
import AdminCategories from '../Pages/admin/AdminCategories';
import AdminOrders from '../Pages/admin/AdminOrders';
import AdminCustomers from '../Pages/admin/AdminCustomers';

import { ROUTES } from '../constants/routes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Storefront Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="categories" element={<Categories />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="account" element={<Account />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* Admin Portal Layout (Protected via AdminLayout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
