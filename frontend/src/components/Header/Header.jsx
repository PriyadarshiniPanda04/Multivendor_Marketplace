import React, { useState } from 'react';
import TopHeader from './TopHeader';
import CategoryNavbar from './CategoryNavbar';
import AllDrawerMenu from './AllDrawerMenu';
import LocationModal from './LocationModal';

export default function Header() {
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 shadow-xs bg-white">
      <TopHeader onOpenLocationModal={() => setIsLocationModalOpen(true)} />
      <CategoryNavbar onOpenAllMenu={() => setIsAllMenuOpen(true)} />
      
      <AllDrawerMenu
        isOpen={isAllMenuOpen}
        onClose={() => setIsAllMenuOpen(false)}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </header>
  );
}
