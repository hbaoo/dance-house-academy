import React, { useState } from 'react';
import { X, Copy, CheckCircle2, QrCode, User, Phone, MapPin, Truck, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { createOrder } from '../services/apiService';
import { Order } from '../types';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    itemName: string;
    orderCode: string;
    isCartCheckout?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, itemName, orderCode, isCartCheckout = false }) => {
    const { showToast } = useToast();
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [isEstimating, setIsEstimating] = useState(false);
    const [shippingFee, setShippingFee] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingPlatform, setShippingPlatform] = useState<string>('Grab');
    const [serviceType, setServiceType] = useState<string>('express');

    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        phone: '',
        address: '',
        email: ''
    });

    if (!isOpen) return null;

    const SHIPPING_OPTIONS = [
        { id: 'Grab', name: 'Grab', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Grab_logo.svg/1024px-Grab_logo.svg.png' },
        { id: 'be', name: 'be', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Be_app_logo.svg/1024px-Be_app_logo.svg.png' },
        { id: 'xanhSM', name: 'XanhSM', icon: 'https://vics.com.vn/wp-content/uploads/2023/10/taxi-xanhsm.png' }
    ];

    const SERVICE_LEVELS = [
        { id: 'express', name: t('shipping_express'), multiplier: 1.5, desc: 'Giao ngay lập tức' },
        { id: '2h', name: t('shipping_2h'), multiplier: 1.2, desc: 'Giao trong 2 giờ' },
        { id: '4h', name: t('shipping_4h'), multiplier: 1.0, desc: 'Tiết kiệm chi phí' }
    ];

    // Cấu hình VietQR
    const BANK_ID = 'VCB'; // Vietcombank
    const ACCOUNT_NO = '1043710254';
    const TEMPLATE = 'compact2';

    const totalAmount = amount + shippingFee;
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${totalAmount}&addInfo=${encodeURIComponent(orderCode)}&accountName=Dance%20House`;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        showToast(`Đã sao chép ${label}`, 'success');
    };

    const handleEstimateShipping = async () => {
        if (!customerInfo.address.trim()) {
            showToast("Vui lòng nhập địa chỉ để tính phí ship", "error");
            return;
        }
        setIsEstimating(true);

        // Simulating a real shipping calculation with a small delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        try {
            // Refined Mock Logic
            const baseFee = 20000; // Phí cơ bản
            const distanceFactor = customerInfo.address.length % 5; // Giả lập khoảng cách từ độ dài địa chỉ
            const distanceFee = distanceFactor * 8000;

            const selectedService = SERVICE_LEVELS.find(s => s.id === serviceType);
            const multiplier = selectedService?.multiplier || 1.0;

            const finalFee = Math.floor((baseFee + distanceFee) * multiplier);

            setShippingFee(finalFee);
            showToast(`${t('checkout_shipping_calc')} từ ${shippingPlatform} thành công`, "success");
        } catch (error) {
            showToast("Không thể tính phí ship. Vui lòng thử lại.", "error");
        } finally {
            setIsEstimating(false);
        }
    };

    const handleNextStep = async () => {
        if (step === 1) {
            if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
                showToast("Vui lòng điền đầy đủ thông tin", "error");
                return;
            }
            if (shippingFee === 0) {
                showToast("Vui lòng tính phí ship trước khi tiếp tục", "error");
                return;
            }
            setStep(2);
        }
    };

    const handleSubmitOrder = async () => {
        setIsProcessing(true);
        const newOrder: Order = {
            customer_name: customerInfo.name,
            customer_email: customerInfo.email || 'customer@example.com',
            customer_phone: customerInfo.phone,
            shipping_address: customerInfo.address,
            shipping_fee: shippingFee,
            shipping_platform: shippingPlatform,
            shipping_service: serviceType,
            item_name: itemName,
            amount: amount,
            status: 'pending',
            order_code: orderCode
        };

        try {
            await createOrder(newOrder);
            showToast("Đã ghi nhận thông tin đặt hàng!", "success");
            onClose();
        } catch (error) {
            showToast("Lỗi khi lưu đơn hàng", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
            <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300 my-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-2">
                        <div className={`w-8 h-1 rounded-full transition-all ${step === 1 ? 'bg-rose-500 w-12' : 'bg-slate-100'}`} />
                        <div className={`w-8 h-1 rounded-full transition-all ${step === 2 ? 'bg-rose-500 w-12' : 'bg-slate-100'}`} />
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-serif text-slate-900">{t('checkout_step_info')}</h2>
                            <p className="text-sm text-slate-400 mt-1">Cung cấp thông tin và chọn phương thức giao hàng</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                <input
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    placeholder={t('checkout_name')}
                                    value={customerInfo.name}
                                    onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                <input
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    placeholder={t('checkout_phone')}
                                    value={customerInfo.phone}
                                    onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all resize-none h-20"
                                    placeholder={t('checkout_address')}
                                    value={customerInfo.address}
                                    onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {SHIPPING_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => { setShippingPlatform(opt.id); setShippingFee(0); }}
                                        className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 ${shippingPlatform === opt.id ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-500/10' : 'bg-slate-50 border-slate-100 hover:border-rose-200'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-white p-1">
                                            <img src={opt.icon} className="w-full h-full object-contain" alt={opt.name} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{opt.name}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {SERVICE_LEVELS.map(lvl => (
                                    <button
                                        key={lvl.id}
                                        onClick={() => { setServiceType(lvl.id); setShippingFee(0); }}
                                        className={`p-3 rounded-2xl border transition-all text-center ${serviceType === lvl.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                                    >
                                        <div className="text-[10px] font-bold uppercase tracking-widest mb-1">{lvl.name}</div>
                                        <div className={`text-[8px] opacity-60 ${serviceType === lvl.id ? 'text-white' : 'text-slate-400'}`}>{lvl.desc}</div>
                                    </button>
                                ))}
                            </div>

                            <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${shippingFee > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3">
                                    <Truck className={`w-5 h-5 ${shippingFee > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('checkout_shipping')}</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {shippingFee > 0 ? `${shippingFee.toLocaleString('vi-VN')} VND` : '—'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleEstimateShipping}
                                    disabled={isEstimating}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-200 px-3 py-2 rounded-lg hover:border-rose-500 hover:text-rose-500 transition-all disabled:opacity-50"
                                >
                                    {isEstimating ? t('checkout_shipping_estimating') : t('checkout_shipping_calc')}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleNextStep}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 transition-all shadow-xl"
                        >
                            {t('checkout_next')} <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-slate-400" />
                            </button>
                            <h2 className="text-xl font-serif text-slate-900">{t('checkout_step_payment')}</h2>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100">
                            <div className="mb-4 inline-block bg-white p-3 rounded-2xl shadow-sm border border-rose-50 max-w-full">
                                <img src={qrUrl} alt="VietQR Payment" className="w-40 h-40 md:w-48 md:h-48 object-contain mx-auto" />
                            </div>

                            <div className="space-y-2 text-xs md:text-sm">
                                <div className="flex justify-between items-center group">
                                    <span className="text-slate-400 font-medium">Số tiền hàng:</span>
                                    <span className="font-bold text-slate-700">{amount.toLocaleString('vi-VN')} VND</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-slate-400 font-medium">Phí vận chuyển:</span>
                                    <span className="font-bold text-emerald-500">+{shippingFee.toLocaleString('vi-VN')} VND</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 flex justify-between items-center group">
                                    <span className="text-slate-700 font-bold">{t('checkout_total')}:</span>
                                    <span className="font-bold text-rose-500 text-lg">{totalAmount.toLocaleString('vi-VN')} VND</span>
                                </div>
                                <div className="flex justify-between items-center group mt-4 pt-4 border-t border-slate-100">
                                    <span className="text-slate-400 font-medium">Nội dung:</span>
                                    <span className="font-bold text-slate-700 flex items-center gap-2">
                                        {orderCode}
                                        <Copy className="w-3 h-3 cursor-pointer opacity-50" onClick={() => copyToClipboard(orderCode, 'nội dung')} />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 text-[10px] leading-relaxed">
                                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Hệ thống tự động ghi nhận khi nhận được chuyển khoản. Vui lòng bấm "Tôi đã chuyển khoản" để hoàn tất đơn hàng.</p>
                            </div>

                            <button
                                onClick={handleSubmitOrder}
                                disabled={isProcessing}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tôi đã chuyển khoản"}
                            </button>
                        </div>
                    </div>
                )}

                <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest italic">
                    Dance House Premium Ballet Academy
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;
