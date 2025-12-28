import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Loader2, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { getMonthlyRevenue, MonthlyRevenue } from '../../../services/reportService';
import { useToast } from '../../../contexts/ToastContext';

const RevenueReport: React.FC = () => {
    const [data, setData] = useState<MonthlyRevenue[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await getMonthlyRevenue();
            setData(result);
        } catch (error) {
            console.error(error);
            showToast('Không thể tải báo cáo doanh thu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total_revenue, 0);
    const avgRevenue = data.length > 0 ? totalRevenue / data.length : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-serif text-slate-900 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-rose-500" />
                        Báo cáo Doanh thu
                    </h1>
                    <p className="text-slate-400 mt-1">Theo dõi hiệu quả kinh doanh</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Trung bình tháng</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(avgRevenue)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Giao dịch</p>
                            <p className="text-2xl font-bold text-slate-900">{data.reduce((acc, curr) => acc + curr.transaction_count, 0)} đơn</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Biểu đồ doanh thu theo tháng</h2>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickFormatter={(val) => `T${val}`}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                tickFormatter={(val) => `${val / 1000000}tr`}
                                axisLine={false}
                                tickLine={false}
                                dx={-10}
                            />
                            <Tooltip
                                formatter={(val: number) => [formatCurrency(val), 'Doanh thu']}
                                labelFormatter={(label) => `Tháng ${label}`}
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="total_revenue"
                                fill="#f43f5e"
                                radius={[8, 8, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default RevenueReport;
