
import React, { useState, useEffect } from 'react';
import { fetchTransactions, updateTransactionStatus, enrollStudentFromTransaction } from '../../services/transactionService';
import { Transaction } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { CheckCircle2, XCircle, Clock, Loader2, Search, RefreshCw, AlertCircle } from 'lucide-react';

const TransactionManager: React.FC = () => {
    const { showToast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchTransactions();
            setTransactions(data);
        } catch (error) {
            showToast("Lỗi khi tải giao dịch", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleVerify = async (transaction: Transaction) => {
        if (!confirm(`Xác nhận thanh toán cho đơn ${transaction.order_code}? Hành động này sẽ tự động tạo thẻ thành viên cho học viên.`)) return;

        setProcessingId(transaction.id);
        try {
            // 1. Verify Transaction
            await updateTransactionStatus(transaction.id, 'completed');

            // 2. Auto Enroll
            await enrollStudentFromTransaction(transaction);

            showToast("Đã xác nhận thanh toán & Tạo thẻ thành viên thành công!", "success");
            loadData();
        } catch (error) {
            console.error(error);
            showToast("Lỗi khi xử lý. Vui lòng kiểm tra lại.", "error");
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Bạn có chắc muốn hủy giao dịch này?')) return;
        try {
            await updateTransactionStatus(id, 'cancelled');
            showToast("Đã hủy giao dịch", "info");
            loadData();
        } catch (error) {
            showToast("Lỗi khi hủy giao dịch", "error");
        }
    };

    const filteredTransactions = transactions.filter(t =>
        t.order_code.toLowerCase().includes(filter.toLowerCase()) ||
        t.customer_name.toLowerCase().includes(filter.toLowerCase()) ||
        t.customer_phone.includes(filter)
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Quản lý Đơn hàng Gói học</h1>
                    <p className="text-slate-500 text-sm">Xác nhận thanh toán chuyển khoản & Kích hoạt thẻ học viên.</p>
                </div>
                <button onClick={loadData} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Filter */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã đơn, tên khách, sđt..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Mã đơn</th>
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Khách hàng</th>
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Gói đăng ký</th>
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Số tiền</th>
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Trạng thái</th>
                            <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-rose-500 mx-auto" /></td></tr>
                        ) : filteredTransactions.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-slate-400">Chưa có giao dịch nào</td></tr>
                        ) : (
                            filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-mono font-bold text-slate-600">#{tx.order_code}</td>
                                    <td className="p-6">
                                        <p className="font-bold text-slate-900">{tx.customer_name}</p>
                                        <p className="text-xs text-slate-400">{tx.customer_phone}</p>
                                    </td>
                                    <td className="p-6">
                                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                                            {tx.metadata?.package_name || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-6 font-bold text-rose-500">{tx.amount.toLocaleString()} VND</td>
                                    <td className="p-6">
                                        {tx.status === 'completed' && <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs uppercase"><CheckCircle2 className="w-4 h-4" /> Thành công</span>}
                                        {tx.status === 'pending' && <span className="flex items-center gap-1.5 text-amber-600 font-bold text-xs uppercase"><Clock className="w-4 h-4" /> Đang chờ</span>}
                                        {tx.status === 'cancelled' && <span className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase"><XCircle className="w-4 h-4" /> Đã hủy</span>}
                                    </td>
                                    <td className="p-6 text-right">
                                        {tx.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleVerify(tx)}
                                                    disabled={processingId === tx.id}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase disabled:opacity-50 transition-all flex items-center gap-2"
                                                >
                                                    {processingId === tx.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(tx.id)}
                                                    disabled={processingId === tx.id}
                                                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all"
                                                >
                                                    Hủy
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

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">Cơ chế Tự động Kích hoạt:</p>
                    <p>Khi bạn nhấn <strong>"Duyệt"</strong>, hệ thống sẽ tự động:</p>
                    <ul className="list-disc ml-4 mt-1 space-y-1 text-blue-700/80">
                        <li>Tìm học viên có số điện thoại tương ứng (hoặc tạo mới hồ sơ học viên).</li>
                        <li>Tạo thẻ thành viên mới với số buổi và thời hạn từ gói đã mua.</li>
                        <li>Cập nhật trạng thái đơn hàng thành "Thành công".</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TransactionManager;
