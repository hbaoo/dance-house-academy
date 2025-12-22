
import React from 'react';
import { Sparkles, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      {/* Newsletter Section */}
      <section className="bg-[#FF4D8D] py-24 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-xl text-center lg:text-left">
            <h2 className="text-5xl lg:text-6xl text-white italic serif mb-6">Stay on Your Toes</h2>
            <p className="text-pink-100 text-lg font-light leading-relaxed">
              Join our mailing list for updates on recital dates, masterclasses, and new boutique arrivals.
            </p>
          </div>
          
          <div className="w-full max-w-lg relative">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full bg-white/95 h-16 rounded-full px-10 outline-none text-gray-800 focus:bg-white transition-all shadow-xl"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-gray-900 text-white px-10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
              Join
            </button>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
      </section>

      {/* Main Footer Content */}
      <section className="py-24 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="text-pink-500 w-6 h-6" />
              <span className="text-2xl font-semibold tracking-tight italic serif text-gray-900">Dance House</span>
            </div>
            <p className="text-gray-500 leading-relaxed font-light mb-8">
              The premier ballet academy for children and teens. Fostering creativity and confidence through the discipline of classical dance in a warm, nurturing environment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Academy</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-pink-500 transition-colors">Our Classes</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Faculty</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Class Schedule</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Tuition</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Boutique</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-pink-500 transition-colors">Uniforms</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Shoes</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Gift Certificates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Contact</h4>
            <ul className="space-y-6">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-pink-500 shrink-0" />
                <span className="text-sm text-gray-500">123 Arabesque Ave<br />Brooklyn, NY 11211</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-pink-500 shrink-0" />
                <span className="text-sm text-gray-500">hello@dancehouse.com</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-pink-500 shrink-0" />
                <span className="text-sm text-gray-500">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <section className="py-8 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
          <p>© 2024 Dance House Ballet Studio. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-pink-500">Privacy Policy</a>
            <a href="#" className="hover:text-pink-500">Terms of Service</a>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
