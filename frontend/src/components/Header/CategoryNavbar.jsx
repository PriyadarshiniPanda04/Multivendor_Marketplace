import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const NAVBAR_ITEMS = [
  {
    name: 'For You',
    fullName: 'For You - Personalized Marketplace Recommendations',
    path: '/',
    isHome: true
  },
  {
    name: 'Fashion',
    fullName: 'Fashion, Apparel & Footwear',
    path: '/category/fashion'
  },
  {
    name: 'Mobiles',
    fullName: 'Mobiles, Tablets & Accessories',
    path: '/category/mobiles'
  },
  {
    name: 'Electronics',
    fullName: 'Electronics, Audio & Computers',
    path: '/category/electronics'
  },
  {
    name: 'Beauty',
    fullName: 'Beauty, Personal Care & Fragrances',
    path: '/category/beauty'
  },
  {
    name: 'Home',
    fullName: 'Home, Kitchen & Dining',
    path: '/category/kitchen'
  },
  {
    name: 'Appliances',
    fullName: 'Home & Kitchen Appliances',
    path: '/category/appliances'
  },
  {
    name: 'Toys, ba...',
    fullName: 'Toys, Baby & Kids Products',
    path: '/category/toys'
  },
  {
    name: 'Food & H...',
    fullName: 'Food & Healthcare / Grocery',
    path: '/category/grocery'
  },
  {
    name: 'Auto Acc...',
    fullName: 'Automotive & Vehicle Accessories',
    path: '/shop?category=automotive'
  },
  {
    name: 'Sports & ...',
    fullName: 'Sports, Fitness & Outdoors',
    path: '/category/sports'
  },
  {
    name: 'Furniture',
    fullName: 'Furniture, Decor & Living',
    path: '/category/furniture'
  },
  {
    name: 'Books',
    fullName: 'Books, Stationary & Learning',
    path: '/category/books'
  },
  {
    name: '2 Wheele...',
    fullName: '2 Wheelers, Bikes & Riding Gear',
    path: '/shop?category=vehicles'
  }
];

export default function CategoryNavbar({ onOpenAllMenu }) {
  const location = useLocation();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to display left/right navigation arrows
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <nav className="w-full bg-white border-t border-slate-200/90 border-b border-slate-200/80 relative z-30 select-none shadow-2xs">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-6 relative flex items-center group">
        
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            className="absolute left-1 z-20 w-7 h-7 bg-white/95 hover:bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Horizontal Category List */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-center gap-6 sm:gap-7 md:gap-8 lg:gap-9 overflow-x-auto no-scrollbar scroll-smooth py-2.5 w-full text-[13px] sm:text-[13.5px]"
        >
          {/* Optional All Drawer Trigger */}
          {onOpenAllMenu && (
            <button
              onClick={onOpenAllMenu}
              className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 font-medium shrink-0 cursor-pointer transition-colors pr-2 border-r border-slate-200/70"
              title="Open All Categories Menu"
            >
              <Menu className="w-3.5 h-3.5 text-slate-800" />
              <span>All</span>
            </button>
          )}

          {NAVBAR_ITEMS.map((item) => {
            const isHomeActive = item.isHome && (location.pathname === '/' || location.pathname === '');
            const isCategoryActive = !item.isHome && (
              location.pathname === item.path ||
              (item.path.startsWith('/category/') && location.pathname.startsWith(item.path))
            );
            const isActive = isHomeActive || isCategoryActive;

            return (
              <Link
                key={item.name}
                to={item.path}
                title={item.fullName}
                className={`shrink-0 whitespace-nowrap transition-colors relative py-0.5 ${
                  isActive
                    ? 'font-bold text-slate-950 after:absolute after:bottom-[-9px] after:inset-x-0 after:h-[2px] after:bg-blue-600'
                    : 'font-normal text-slate-800 hover:text-blue-600 hover:font-medium'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            className="absolute right-1 z-20 w-7 h-7 bg-white/95 hover:bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

      </div>
    </nav>
  );
}
