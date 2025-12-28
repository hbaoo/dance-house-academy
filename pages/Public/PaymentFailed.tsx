import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, Home, Package2 } from 'lucide-react';

const PaymentFailed: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const orderCode = params.get('orderCode');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
            <div className="max-w-md mx-auto px-6">
                <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-serif text-slate-900 mb-2">Thanh toán thất bại</h2>
                        <p className="text-slate-600">
                            Giao dịch của bạn chưa hoàn tất. Vui lòng thử lại.
                        </p>
                    </div>

                    {orderCode && (
                        <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                            <p className="text-xs text-slate-500 text-center">
                                Mã đơn hàng: <span className="font-mono font-bold text-slate-700">{orderCode}</span>
                            </p>
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-6">
                        <p className="text-sm text-yellow-900">
                            <strong>Lý do có thể:</strong>
                        </p>
                        <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                            <li>Bạn đã hủy giao dịch</li>
                            <li>Không đủ số dư trong tài khoản</li>
                            <li>Phiên thanh toán đã hết hạn</li>
                            <li>Lỗi kết nối mạng</li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                        >
                            <Home className="w-5 h-5" />
                            Về trang chủ
                        </button>
                        <button
                            onClick={() => navigate('/packages')}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all"
                        >
                            <Package2 className="w-5 h-5" />
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
