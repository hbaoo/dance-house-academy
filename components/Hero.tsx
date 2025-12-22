
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative px-6 py-8">
      <div className="max-w-7xl mx-auto relative rounded-[40px] overflow-hidden min-h-[600px] flex items-center justify-center text-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80&w=2000)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white/10 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-6">
          <span className="inline-block bg-[#FF4D8D] text-white text-[10px] uppercase font-bold tracking-[0.2em] px-4 py-2 rounded-full mb-6">
            Enrolling Now For Fall
          </span>
          <h1 className="text-7xl md:text-8xl text-gray-900 mb-8 leading-tight">
            Grace & <span className="italic text-[#FF4D8D]">Poise</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
            Where every step tells a story. Nurturing the next generation of dancers with classical training in an inspiring, supportive atmosphere.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-[#FF4D8D] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-pink-600 transition-all">
              View Classes
            </button>
            <button className="w-full sm:w-auto bg-white/90 text-gray-800 px-10 py-4 rounded-full font-bold uppercase tracking-widest border border-gray-100 hover:bg-white transition-all">
              Visit Shop
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
