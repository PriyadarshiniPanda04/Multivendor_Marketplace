import React from 'react';
import { Truck, Headphones, RotateCcw, CreditCard, BadgePercent } from 'lucide-react';

export default function TrustBanner() {
  const TRUST_ITEMS = [
    {
      icon: Truck,
      title: 'Free Delivery',
      subtitle: 'From ₹499',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Headphones,
      title: 'Support 24/7',
      subtitle: 'Online 24 hours',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: RotateCcw,
      title: 'Free Return',
      subtitle: '30 days a year',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: CreditCard,
      title: 'Payment Method',
      subtitle: 'Secure payment',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      icon: BadgePercent,
      title: 'Big Saving',
      subtitle: 'Weekend Sales',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    }
  ];

  return (
    <div className="w-full max-w-[1536px] mx-auto py-5 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs select-none">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 divide-y sm:divide-y-0 divide-slate-100">
        {TRUST_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className={`flex items-center gap-3.5 pt-3 sm:pt-0 ${
                idx > 0 ? 'lg:border-l lg:border-slate-100 lg:pl-6' : ''
              }`}
            >
              <div className={`w-11 h-11 rounded-full ${item.bgColor} ${item.color} flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
