import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon } from 'lucide-react';

export default function HomeKitchenSection() {
  const HOME_ITEMS = [
    { name: "Kitchen Appliances", sub: "Air Fryers & Blenders", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80", link: "/category/kitchen" },
    { name: "Solid Wood Furniture", sub: "Desks, Chairs & Sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80", link: "/category/furniture" },
    { name: "Home Decor & Accents", sub: "Planters & Ceramic Vases", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80", link: "/category/furniture" },
    { name: "Pantry & Organizers", sub: "Aesthetic Glass & Bins", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80", link: "/category/kitchen" },
    { name: "Tri-Ply Cast Cookware", sub: "Kadhais, Pans & Pots", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80", link: "/category/kitchen" },
    { name: "Minimalist Lighting", sub: "Ambient Lamps & Glow LEDs", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80", link: "/category/furniture" }
  ];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-600">Living Spaces</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Home & Kitchen Living
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Upgrade your sanctuary with handcrafted wooden furniture and smart culinary appliances</p>
        </div>
        <Link 
          to="/category/kitchen" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-indigo-600 group transition-colors"
        >
          <span>Explore Home Store</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {HOME_ITEMS.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            className="group bg-slate-50/70 rounded-2xl overflow-hidden border border-slate-200/70 hover:border-slate-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="pt-[100%] relative overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="p-3 text-center">
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {item.name}
              </h3>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.sub}</p>
              <span className="text-[11px] text-slate-500 group-hover:text-indigo-600 font-medium group-hover:underline mt-1 inline-block">
                Shop range →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
