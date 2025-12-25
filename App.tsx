import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Loader2, Heart, MessageCircle } from 'lucide-react';
import { fetchClasses, fetchProducts, createOrder } from './services/apiService';
import { getDanceAdvisorResponse } from './services/geminiService';
import { DanceClass, Product, Order } from './types';
import Login from './pages/Admin/Login';
import AdminLayout from './pages/Admin/Layout';
import ClassManager from './pages/Admin/ClassManager';
import ProductManager from './pages/Admin/ProductManager';
import RequireAuth from './components/RequireAuth';
import PublicNavbar from './components/PublicNavbar';
import PublicFooter from './components/PublicFooter';
import Programs from './pages/Public/Programs';
import Instructors from './pages/Public/Instructors';
import Facilities from './pages/Public/Facilities';
import News from './pages/Public/News';
import Contact from './pages/Public/Contact';
import PaymentModal from './components/PaymentModal';

import { useLanguage } from './contexts/LanguageContext';
import { useToast } from './contexts/ToastContext';

// --- HomePage Component ---
const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [classes, setClasses] = useState<DanceClass[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ name: string, price: number } | null>(null);
  const [currentOrderCode, setCurrentOrderCode] = useState('');

  useEffect(() => {
    Promise.all([fetchClasses(), fetchProducts()]).then(([c, p]) => {
      setClasses(c);
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setIsAiThinking(true);
    const result = await getDanceAdvisorResponse(aiInput);
    setAiOutput(result);
    setIsAiThinking(false);
  };

  const handleStartPayment = async (name: string, price: number) => {
    const orderCode = `DH${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      customer_name: 'Khách hàng mới',
      customer_email: 'customer@example.com',
      item_name: name,
      amount: price,
      status: 'pending',
      order_code: orderCode
    };

    try {
      await createOrder(newOrder);
      setSelectedItem({ name, price });
      setCurrentOrderCode(orderCode);
      setIsPaymentModalOpen(true);
    } catch (error) {
      showToast("Không thể khởi tạo đơn hàng. Vui lòng thử lại.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-rose-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">{t('subtitle')}</span>
            <h1 className="text-6xl md:text-8xl leading-tight mb-8 serif">{t('hero_title_prefix')} <span className="italic text-rose-500">{t('hero_title_accent')}</span> {t('hero_title_suffix')}</h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed mb-10 max-w-lg">
              {t('hero_desc')}
            </p>
            <div className="flex gap-4">
              <button onClick={() => document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' })} className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-rose-500 transition-all">{t('learn_more')}</button>
              <button onClick={() => showToast("Mời bạn ghé thăm studio tại: 123 Arabesque Ave, Brooklyn, NY 11211", 'info')} className="border border-slate-200 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">{t('visit_studio')}</button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Ballerina" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[40px] shadow-xl border border-rose-50 max-w-xs hidden lg:block">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Heart key={i} className="w-4 h-4 text-rose-400 fill-rose-400" />)}
              </div>
              <p className="text-sm font-medium italic serif">"{t('hero_quote')}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Advisor Tool */}
      <section className="py-20 bg-rose-50 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-rose-100">
          <div className="text-center mb-10">
            <MessageCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
            <h2 className="text-4xl serif mb-4">{t('ai_title')}</h2>
            <p className="text-slate-400">{t('ai_desc')}</p>
          </div>
          <form onSubmit={handleAskAi} className="relative mb-8">
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder={t('ai_placeholder')}
              className="w-full h-16 rounded-full bg-slate-50 px-8 outline-none focus:ring-2 focus:ring-rose-200 transition-all"
            />
            <button
              disabled={isAiThinking}
              className="absolute right-2 top-2 bottom-2 bg-rose-500 text-white px-8 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose-600 disabled:opacity-50"
            >
              {isAiThinking ? <Loader2 className="animate-spin w-4 h-4" /> : t('ai_send')}
            </button>
          </form>
          {aiOutput && (
            <div className="p-8 bg-rose-50/50 rounded-[30px] border border-rose-100 animate-in fade-in duration-500">
              <p className="text-rose-900 leading-relaxed font-medium italic serif text-lg">{aiOutput}</p>
            </div>
          )}
        </div>
      </section>

      {/* Class Schedule */}
      <section id="classes" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-rose-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">{t('schedule_label')}</span>
              <h2 className="text-5xl serif">{t('class_list_title')}</h2>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors">
              {t('view_full_schedule')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>
            ) : (
              classes.map(cls => (
                <div key={cls.id} className="group bg-[#FCF8F9] p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-white hover:shadow-2xl hover:shadow-rose-100 transition-all border border-transparent hover:border-rose-100">
                  <div className="flex items-center gap-12">
                    <div className="text-center md:text-left min-w-[100px]">
                      <p className="text-2xl font-bold text-rose-500 mb-1">{cls.time}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cls.duration}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>
                    <div>
                      <h3 className="text-2xl serif mb-1">{cls.title}</h3>
                      <p className="text-sm text-slate-400">{cls.studio} • {cls.age_range}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                      <img src={cls.instructor.avatar} className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all" alt={cls.instructor.name} />
                      <div>
                        <p className="text-sm font-semibold">{cls.instructor.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cls.instructor.role}</p>
                      </div>
                    </div>
                    <button onClick={() => handleStartPayment(cls.title, cls.price)} className="bg-white border border-rose-100 text-rose-500 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                      {t('register_btn')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Boutique Store */}
      <section id="boutique" className="py-24 px-6 bg-[#FCF8F9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl serif mb-4">{t('boutique_title')}</h2>
            <p className="text-slate-400 uppercase tracking-widest text-[10px] font-bold">{t('boutique_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map(prod => (
              <div key={prod.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-[50px] overflow-hidden mb-6 bg-slate-200">
                  <img src={prod.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={prod.name} />
                  {prod.badge && (
                    <span className="absolute top-6 left-6 bg-rose-500 text-white text-[9px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                      {prod.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleStartPayment(prod.name, prod.price)} className="bg-white text-slate-900 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ShoppingBag className="w-4 h-4" /> {t('add_to_cart')}
                    </button>
                  </div>
                </div>
                <h3 className="text-xl serif text-center mb-2">{prod.name}</h3>
                <p className="text-rose-500 font-bold text-center">{prod.price.toLocaleString('vi-VN')} VND</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />

      {selectedItem && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          amount={selectedItem.price}
          itemName={selectedItem.name}
          orderCode={currentOrderCode}
        />
      )}
    </div>
  );
};

// --- Main App with Routes ---
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/instructors" element={<Instructors />} />
      <Route path="/facilities" element={<Facilities />} />
      <Route path="/news" element={<News />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      }>
        <Route path="classes" element={<ClassManager />} />
        <Route path="products" element={<ProductManager />} />
        <Route index element={<ClassManager />} />
      </Route>
    </Routes>
  );
};

export default App;
