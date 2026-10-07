import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden pb-16 md:pb-0">
      <Header />
      <main className="flex-1 w-full max-w-[1536px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
