
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProducts } from '../services/apiService';
import { Loader2 } from 'lucide-react';

const Boutique: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      if (data) {
        setProducts(data);
      } else {
        // Fallback for demo, ensuring id is a number to match type definition
        setProducts([
          { id: 1, name: "Satin Ballet Shoes", price: 35.00, image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&q=80&w=800", badge: "NEW SEASON" }
        ]);
      }
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <section className="py-24 px-6 bg-[#FCF8F9]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#FF4D8D] mb-4 block">The Boutique</span>
            <h2 className="text-5xl text-gray-900">Dance Essentials</h2>
          </div>
          <a href="#" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-800 border-b-2 border-gray-800 pb-1 hover:text-pink-600 hover:border-pink-600 transition-all">
            View Collection
          </a>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-pink-300" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-100 mb-6">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {product.badge && <span className="absolute top-6 left-6 bg-[#FF4D8D] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">{product.badge}</span>}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="bg-white text-gray-900 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all">Add to Bag</button>
                  </div>
                </div>
                <h3 className="text-xl text-gray-800 mb-1 font-medium">{product.name}</h3>
                <p className="text-gray-400 font-light text-lg">${product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Boutique;