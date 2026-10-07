import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PROMO_CARDS = [
  {
    id: 1,
    bg: '#091b2c',
    tag: 'SPORT SHOES',
    tagColor: 'text-cyan-300 font-extrabold text-xs tracking-wider',
    title: 'Now Available!',
    price: '₹1,999',
    priceColor: 'text-cyan-400 font-black text-sm',
    link: '/category/fashion',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    alt: 'Sport Shoes & Sneakers'
  },
  {
    id: 2,
    bg: '#c81e1e',
    tag: '76% OFF',
    tagColor: 'text-white text-lg sm:text-xl font-black leading-none',
    title: 'EVERY THING!',
    titleColor: 'text-white/90 text-[10px] font-bold tracking-wider',
    cta: 'SHOP NOW',
    link: '/category/mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    alt: 'Red Smartphones'
  },
  {
    id: 3,
    bg: '#9b7ebf',
    tag: 'BEACH WEAR',
    tagColor: 'text-white font-extrabold text-xs tracking-wider',
    cta: 'View Now >',
    ctaColor: 'text-pink-100 underline text-[10px] font-medium',
    label: 'STARTING FROM',
    price: '₹399',
    priceColor: 'text-white font-black text-sm drop-shadow-xs',
    link: '/category/fashion',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80',
    alt: 'Beach Wear'
  },
  {
    id: 4,
    bg: '#0284c7',
    tag: 'TECH FESTIVAL',
    tagColor: 'text-white/90 text-[10px] font-bold tracking-wider',
    title: 'SALE',
    titleColor: 'text-white font-black text-base tracking-tight leading-none',
    price: '₹4,999',
    priceColor: 'text-white font-black text-sm',
    link: '/category/electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80',
    alt: 'Laptop Deals'
  },
  {
    id: 5,
    bg: '#ea580c',
    tag: 'ON THIS FRIDAY',
    tagColor: 'text-white/90 text-[10px] font-bold tracking-wider',
    title: 'SALE',
    titleColor: 'text-white font-black text-base tracking-tight leading-none',
    label: 'STARTING FROM',
    price: '₹899',
    priceColor: 'text-white font-black text-sm',
    link: '/category/smartwatches',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&auto=format&fit=crop&q=80',
    alt: 'Smart Camera'
  },
  {
    id: 6,
    bg: '#144d3b',
    tag: 'ON THIS FRIDAY',
    tagColor: 'text-white/80 text-[10px] font-bold tracking-wider',
    title: 'SALE',
    titleColor: 'text-white font-black text-base tracking-tight leading-none',
    discount: '50% OFF',
    discountColor: 'text-amber-300 font-black text-sm',
    link: '/category/beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    alt: 'Beauty Skincare'
  }
];

export default function HeroPromoGrid() {
  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-2.5 sm:gap-3 h-full">
      {PROMO_CARDS.map((card) => (
        <Link
          key={card.id}
          to={card.link}
          style={{ backgroundColor: card.bg }}
          className="group relative rounded-xl sm:rounded-2xl overflow-hidden p-3 sm:p-4 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:brightness-105 min-h-[140px] sm:min-h-[150px] lg:min-h-0 h-full"
        >
          {/* Left Text Column */}
          <div className="relative z-10 max-w-[55%] flex flex-col justify-center space-y-1">
            {/* Tag / Category */}
            <span className={card.tagColor}>
              {card.tag}
            </span>

            {/* Title / Sale headline */}
            {card.title && (
              <span className={card.titleColor || 'text-white font-semibold text-xs'}>
                {card.title}
              </span>
            )}

            {/* CTA Link */}
            {card.cta && (
              <span className={card.ctaColor || 'text-white/90 text-[10px] font-semibold flex items-center gap-0.5 pt-0.5'}>
                {card.cta}
                <ChevronRight className="w-3 h-3 inline-block" />
              </span>
            )}

            {/* Label e.g. STARTING FROM */}
            {card.label && (
              <span className="text-[9px] font-semibold text-white/80 uppercase tracking-wider block pt-0.5">
                {card.label}
              </span>
            )}

            {/* Price */}
            {card.price && (
              <span className={card.priceColor || 'text-white font-bold text-sm'}>
                {card.price}
              </span>
            )}

            {/* Discount Badge */}
            {card.discount && (
              <span className={card.discountColor || 'text-amber-300 font-extrabold text-sm'}>
                {card.discount}
              </span>
            )}
          </div>

          {/* Right Floating Product/Lifestyle Image */}
          <div className="absolute right-0 bottom-0 top-0 w-[50%] overflow-hidden flex items-center justify-end pointer-events-none">
            <img
              src={card.image}
              alt={card.alt}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)'
              }}
            />
          </div>

          {/* Subtle glossy sheen on hover */}
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </Link>
      ))}
    </div>
  );
}
