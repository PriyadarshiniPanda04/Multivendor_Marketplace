import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import ShopByCategory from '../components/ShopByCategory';
import DealSection from '../components/DealSection';
import FlashDeals from '../components/FlashDeals';
import FavoriteDeals from '../components/FavoriteDeals';
import ProductCarousel from '../components/ProductCarousel';
import ElectronicsSection from '../components/ElectronicsSection';
import FashionSection from '../components/FashionSection';
import HomeKitchenSection from '../components/HomeKitchenSection';
import RecommendedSection from '../components/RecommendedSection';
import RecentlyViewedSection from '../components/RecentlyViewedSection';
import SellerSection from '../components/SellerSection';
import { PRODUCTS } from '../data/mockData';

export default function HomePage() {
  const bestSellersElectronics = PRODUCTS.filter(
    (p) => (p.category === 'electronics' || p.category === 'mobiles' || p.category === 'smartwatches') && p.isBestSeller
  );

  const customersAlsoBoughtHomepage = PRODUCTS.filter(
    (p) => p.rating >= 4.5 && p.reviewCount > 100
  ).slice(0, 8);

  return (
    <div className="space-y-10 sm:space-y-14">
      
      {/* 1. Hero Section (Slider + Right-Side Promo Grid) */}
      <HeroCarousel />

      {/* 2. Complete Shop by Category Grid (All 15 Marketplace Categories) */}
      <ShopByCategory />

      {/* 3. Personalized: Recommended For You (Based on browsing history) */}
      <RecommendedSection />

      {/* 4. Personalized: Recently Viewed Items */}
      <RecentlyViewedSection />

      {/* 5. Today's Best Deals */}
      <DealSection />

      {/* 6. Motta Flash Deals Section */}
      <FlashDeals />

      {/* 7. Our Favorite Deals This Week */}
      <FavoriteDeals />

      {/* 8. Best Sellers in Electronics & Gadgets */}
      <ProductCarousel
        title="Best Sellers in Electronics & Gadgets"
        subtitle="Most bought items by verified customers this week"
        products={bestSellersElectronics}
        viewAllLink="/category/electronics"
      />

      {/* 9. Customers Also Bought (Popular Marketplace Co-Purchases) */}
      <ProductCarousel
        title="Customers Also Bought"
        subtitle="Highly rated items frequently purchased together by verified buyers"
        products={customersAlsoBoughtHomepage}
        viewAllLink="/shop"
      />

      {/* 10. Curated Department Showcases */}
      <ElectronicsSection />
      <FashionSection />
      <HomeKitchenSection />

      {/* 11. Verified Marketplace Sellers & Stores */}
      <SellerSection />

    </div>
  );
}
