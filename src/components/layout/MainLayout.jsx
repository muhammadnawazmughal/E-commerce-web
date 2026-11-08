import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import CartDrawer from '../cart/CartDrawer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF7]">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
