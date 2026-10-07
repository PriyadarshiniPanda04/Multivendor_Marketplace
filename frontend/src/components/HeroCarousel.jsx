import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import HeroPromoGrid from './HeroPromoGrid';

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(null);

  const SLIDES = [
    {
      tag: "NEW ARRIVALS",
      title: "Hot\nRight\nNow",
      subtitle: "Retro Remixed For The Future",
      priceText: "Starting at ₹1,999",
      link: "/category/fashion",
      cta: "Shop Now",
      gradient: "radial-gradient(circle at 75% 50%, #ff8364 0%, #ff5226 45%, #e03206 100%)",
      productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80"
    },
    {
      tag: "FLAGSHIP LAUNCH",
      title: "Sound\nRedefined\nToday",
      subtitle: "Pure Studio Active Noise Cancelling",
      priceText: "Starting at ₹4,499",
      link: "/category/electronics",
      cta: "Shop Now",
      gradient: "radial-gradient(circle at 75% 50%, #60a5fa 0%, #2563eb 45%, #1e40af 100%)",
      productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80"
    },
    {
      tag: "SMART TECH",
      title: "Wrist\nPrecision\nPro",
      subtitle: "AMOLED Display with All-Day Battery",
      priceText: "Starting at ₹3,299",
      link: "/category/smartwatches",
      cta: "Discover More",
      gradient: "radial-gradient(circle at 75% 50%, #a78bfa 0%, #7c3aed 45%, #5b21b6 100%)",
      productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80"
    },
    {
      tag: "LIMITED EDITION",
      title: "Living\nRoom\nComfort",
      subtitle: "Handcrafted Scandinavian Walnut Wood",
      priceText: "Save 30% Today",
      link: "/category/kitchen",
      cta: "Shop Now",
      gradient: "radial-gradient(circle at 75% 50%, #34d399 0%, #059669 45%, #065f46 100%)",
      productImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&auto=format&fit=crop&q=80"
    }
  ];

  // Automatic slide interval: slides every 4 seconds continuously
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [currentSlide, SLIDES.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const active = SLIDES[currentSlide];

  return (
    <div 
      className="w-full max-w-[1536px] mx-auto select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
        
        {/* Left: Auto-Sliding Hero Carousel (Takes ~60-65% width on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <div 
            className="relative rounded-2xl overflow-hidden shadow-sm min-h-[420px] sm:min-h-[460px] lg:min-h-[500px] h-full flex items-center transition-all duration-700 ease-out w-full"
            style={{ background: active.gradient }}
          >
            {/* Decorative graphic curves */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <svg className="w-full h-full" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-100 100 C 300 350, 500 -100, 1100 200" stroke="white" strokeWidth="50" strokeLinecap="round" opacity="0.4"/>
                <path d="M-50 250 C 400 500, 600 50, 1150 350" stroke="white" strokeWidth="70" strokeLinecap="round" opacity="0.3"/>
              </svg>
            </div>

            {/* Banner Content Container */}
            <div className="relative z-10 w-full px-6 sm:px-10 lg:px-12 py-8 flex flex-col justify-between h-full">
              
              {/* Top Text Content with smooth fade/slide key */}
              <div 
                key={`content-${currentSlide}`}
                className="max-w-xs sm:max-w-sm lg:max-w-md text-white space-y-3 animate-in fade-in slide-in-from-left-4 duration-500"
              >
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-white/90">
                  {active.tag}
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.05] whitespace-pre-line drop-shadow-sm">
                  {active.title}
                </h1>

                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  {active.subtitle}
                </p>

                <p className="text-xs sm:text-sm font-bold text-white/95">
                  {active.priceText}
                </p>

                <div className="pt-2">
                  <Link
                    to={active.link}
                    className="inline-block px-6 py-2.5 bg-white text-slate-950 font-bold text-xs sm:text-sm rounded-md shadow-md hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {active.cta}
                  </Link>
                </div>
              </div>

              {/* Bottom Controls: Dots Left & Arrow Buttons Right */}
              <div className="pt-8 flex items-center justify-between">
                
                {/* Slide Dots with Active Progress */}
                <div className="flex items-center gap-2">
                  {SLIDES.map((_, idx) => {
                    const isActive = currentSlide === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                          isActive ? 'w-8 bg-white/40' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      >
                        {isActive && (
                          <span 
                            key={`bar-${currentSlide}`}
                            className="absolute inset-0 bg-white rounded-full origin-left"
                            style={{
                              animation: 'progress 4000ms linear forwards'
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Next / Previous Arrow Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-800 shadow-md flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-800 shadow-md flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Big Featured Floating Product Image with Keyed Fade/Zoom */}
            <div 
              key={`image-${currentSlide}`}
              className="absolute right-2 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-44 sm:w-60 lg:w-[280px] xl:w-[350px] pointer-events-none drop-shadow-2xl animate-in fade-in zoom-in-95 duration-500"
            >
              <img
                src={active.productImage}
                alt={active.title.replace(/\n/g, ' ')}
                className="w-full h-auto object-contain transform -rotate-12 transition-transform duration-700"
              />
            </div>

          </div>
        </div>

        {/* Right: 6 Promotional Cards Grid (From Reference Design) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between">
          <HeroPromoGrid />
        </div>

      </div>
    </div>
  );
}
