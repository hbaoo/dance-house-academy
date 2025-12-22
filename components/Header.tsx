
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-pink-500 w-6 h-6" />
          <span className="text-2xl font-semibold tracking-tight italic serif">Dance House</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 uppercase tracking-widest">
          <a href="#" className="hover:text-pink-500 transition-colors">Home</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Classes</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Instructors</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Boutique</a>
          <a href="#" className="hover:text-pink-500 transition-colors">Contact</a>
        </nav>

        <button className="bg-[#FF4D8D] text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-pink-600 transition-all transform hover:scale-105">
          Book Trial
        </button>
      </div>
    </header>
  );
};

export default Header;
