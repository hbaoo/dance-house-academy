
import React from 'react';
import { X, Copy, CheckCircle2, QrCode } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    itemName: string;
    orderCode: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, itemName, orderCode }) => {
    const { showToast } = useToast();

    if (!isOpen) return null;

    // Cấu hình VietQR
    const BANK_ID = 'VCB'; // Vietcombank
    const ACCOUNT_NO = '1043710254';
    const TEMPLATE = 'compact2'; // Giao diện QR tối giản

    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${encodeURIComponent(orderCode)}&accountName=Dance%20House`;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        showToast(`Đã sao chép ${label}`, 'success');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6 text-slate-400" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QrCode className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-serif">Thanh toán khóa học</h2>
                    <p className="text-slate-400 text-sm mt-1">Vui lòng quét mã QR để hoàn tất đăng ký</p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 mb-8 text-center border border-slate-100">
                    <div className="mb-4 inline-block bg-white p-4 rounded-2xl shadow-sm border border-rose-50">
                        <img src={qrUrl} alt="VietQR Payment" className="w-48 h-48" />
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center group">
                            <span className="text-slate-400 font-medium">Số tiền:</span>
                            <span className="font-bold text-rose-500 flex items-center gap-2">
                                {amount.toLocaleString('vi-VN')} VND
                                <Copy
                                    className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(amount.toString(), 'số tiền')}
                                />
                            </span>
                        </div>
                        <div className="flex justify-between items-center group">
                            <span className="text-slate-400 font-medium">Nội dung:</span>
                            <span className="font-bold text-slate-700 flex items-center gap-2">
                                {orderCode}
                                <Copy
                                    className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(orderCode, 'nội dung')}
                                />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 text-xs leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Hệ thống sẽ ghi nhận tự động sau khi nhận được chuyển khoản. Vui lòng giữ đúng nội dung chuyển khoản để được xác nhận nhanh nhất.</p>
                    </div>

                    <button
                        onClick={() => {
                            showToast("Đã gửi thông báo xác nhận chuyển khoản!", "success");
                            onClose();
                        }}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-lg"
                    >
                        Tôi đã chuyển khoản
                    </button>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest italic">
                    Dance House Premium Ballet Academy
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;
