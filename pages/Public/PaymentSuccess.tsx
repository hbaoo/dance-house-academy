import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Package2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

const PaymentSuccess: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);
    const [transaction, setTransaction] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderCode = params.get('orderCode');

        if (orderCode) {
            loadTransaction(orderCode);
        } else {
            setError('Không tìm thấy mã đơn hàng');
            setIsProcessing(false);
        }
    }, [location]);

    const loadTransaction = async (orderCode: string) => {
        try {
            // Get transaction from database
            const { data: tx, error: txError } = await supabase
                .from('transactions')
                .select('*, packages(*)')
                .eq('order_code', orderCode)
                .single();

            if (txError) throw new Error('Không tìm thấy giao dịch');

            setTransaction(tx);
        } catch (err: any) {
            console.error('Transaction load failed:', err);
            setError(err.message || 'Có lỗi xảy ra khi tải thông tin giao dịch');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-rose-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
                <div className="max-w-md mx-auto px-6">
                    <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-xl text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-serif text-slate-900 mb-2">Lỗi</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/packages')}
                            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-500 transition-all"
                        >
                            Quay lại trang gói học
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
            <div className="max-w-2xl mx-auto px-6">
                <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-10 h-10 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-serif text-slate-900 mb-2">Đã nhận thông tin thanh toán!</h2>
                        <p className="text-slate-600">Chúng tôi đã ghi nhận yêu cầu đăng ký của bạn</p>
                    </div>

                    {transaction && (
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
                            <h3 className="font-bold text-slate-900 mb-4">Thông tin đơn hàng</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Họ tên:</span>
                                    <span className="font-bold text-slate-900">{transaction.customer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Số điện thoại:</span>
                                    <span className="font-bold text-slate-900">{transaction.customer_phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Gói học:</span>
                                    <span className="font-bold text-slate-900">{transaction.packages?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Số buổi:</span>
                                    <span className="font-bold text-slate-900">{transaction.packages?.total_sessions} buổi</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-3">
                                    <span className="text-slate-600">Tổng thanh toán:</span>
                                    <span className="font-bold text-rose-600 text-lg">
                                        {(transaction.amount / 1000000).toFixed(1)}M VNĐ
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Trạng thái:</span>
                                    <span className="font-bold text-yellow-600">Chờ xác nhận</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-6">
                        <p className="text-sm text-yellow-900">
                            <strong>Bước tiếp theo:</strong> Chúng tôi sẽ xác nhận thanh toán của bạn trong vòng <strong>24 giờ</strong>.
                            Sau khi xác nhận, bạn sẽ nhận được cuộc gọi hoặc tin nhắn từ Dance House Academy để sắp xếp lịch học đầu tiên.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
                        <p className="text-sm text-blue-900">
                            <strong>Lưu ý:</strong> Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ hotline hoặc inbox Facebook page của chúng tôi.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                        >
                            Về trang chủ
                        </button>
                        <button
                            onClick={() => navigate('/packages')}
                            className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl transition-all"
                        >
                            Xem thêm gói khác
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
