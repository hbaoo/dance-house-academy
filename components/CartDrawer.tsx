
import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
    const { cartItems, removeFromCart, updateQuantity, totalAmount, cartCount } = useCart();
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-rose-500" />
                        <h2 className="text-xl font-serif">{t('cart_title')}</h2>
                        <span className="bg-rose-50 text-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {cartCount} {t('cart_items')}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors font-bold">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p className="font-medium italic">{t('cart_empty')}</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-serif text-lg truncate pr-2">{item.name}</h3>
                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-rose-500 font-bold text-sm mb-3">
                                        {item.price.toLocaleString('vi-VN')} VND
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-rose-500 hover:text-rose-500 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-rose-500 hover:text-rose-500 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-serif text-slate-500">{t('cart_total')}</span>
                            <span className="font-bold text-rose-500">{totalAmount.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg active:scale-95"
                        >
                            {t('cart_checkout')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
