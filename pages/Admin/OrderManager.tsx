
import React, { useState, useEffect } from 'react';
import { fetchOrders, updateOrderStatus } from '../../services/apiService';
import { sendOrderConfirmationEmail } from '../../services/emailService';
import { Order } from '../../types';
import { CheckCircle2, XCircle, Clock, RefreshCw, Loader2, Search } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const { showToast } = useToast();

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await fetchOrders();
            setOrders(data);
        } catch (error) {
            showToast("Không thể tải danh sách đơn hàng", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleUpdateStatus = async (order: Order, newStatus: 'completed' | 'cancelled') => {
        try {
            await updateOrderStatus(order.id!, newStatus);

            if (newStatus === 'completed') {
                showToast("Đã xác nhận & Gửi email thông báo", "success");
                await sendOrderConfirmationEmail({
                    customerName: order.customer_name,
                    orderCode: order.order_code,
                    itemName: order.item_name,
                    amount: order.amount
                });
            } else {
                showToast("Đã hủy đơn hàng", "info");
            }

            loadOrders();
        } catch (error) {
            showToast("Cập nhật thất bại", "error");
        }
    };

    const filteredOrders = orders.filter(o =>
        o.order_code.toLowerCase().includes(filter.toLowerCase()) ||
        o.customer_name.toLowerCase().includes(filter.toLowerCase()) ||
        o.item_name.toLowerCase().includes(filter.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-serif mb-2">Quản lý Đơn hàng</h2>
                    <p className="text-slate-400">Xác nhận thanh toán và quản lý đăng ký khóa học</p>
                </div>
                <button
                    onClick={loadOrders}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Tìm theo mã đơn, khách hàng hoặc khóa học..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Mã Đơn / Ngày</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Khách hàng</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Nội dung / Giá</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Trạng thái</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading && orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                                        <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4 text-rose-500" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400">Không tìm thấy đơn hàng nào</td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-6">
                                            <p className="font-bold text-slate-900 mb-1">{order.order_code}</p>
                                            <p className="text-[10px] text-slate-400">{new Date(order.created_at!).toLocaleDateString('vi-VN')}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="font-semibold text-slate-700">{order.customer_name}</p>
                                            <p className="text-xs text-slate-400">{order.customer_email}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="font-semibold text-slate-700">{order.item_name}</p>
                                            <p className="text-sm font-bold text-rose-500">{order.amount.toLocaleString('vi-VN')} VND</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border ${getStatusStyles(order.status)} uppercase tracking-widest`}>
                                                {getStatusIcon(order.status)}
                                                {order.status === 'pending' ? 'Chờ thanh toán' : order.status === 'completed' ? 'Thành công' : 'Đã hủy'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            {order.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(order, 'completed')}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                        title="Xác nhận thanh toán"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order, 'cancelled')}
                                                        className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                        title="Hủy đơn"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderManager;
