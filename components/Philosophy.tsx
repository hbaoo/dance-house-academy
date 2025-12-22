
import React from 'react';
import { Heart, Wind, Sparkles } from 'lucide-react';

const Philosophy: React.FC = () => {
  const features = [
    {
      icon: <Heart className="text-[#FF4D8D] w-6 h-6" />,
      title: "Passion",
      description: "Developing a lifelong love for movement and artistic expression."
    },
    {
      icon: <Wind className="text-[#FF4D8D] w-6 h-6" />,
      title: "Balance",
      description: "Building strength, flexibility, and control through classical technique."
    },
    {
      icon: <Sparkles className="text-[#FF4D8D] w-6 h-6" />,
      title: "Shine",
      description: "Annual recitals and performance opportunities for every star."
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#FCF8F9]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#FF4D8D] mb-4 block">Our Philosophy</span>
            <h2 className="text-5xl text-gray-900">The Art of Ballet</h2>
          </div>
          <div className="flex items-end">
            <p className="text-gray-500 leading-relaxed max-w-lg">
              We believe in the power of dance to transform. From first positions to pirouettes, we cultivate discipline, artistry, and joy in every student.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-12 rounded-[32px] shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 flex items-center justify-center bg-pink-50 rounded-2xl mb-12 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-3xl mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
