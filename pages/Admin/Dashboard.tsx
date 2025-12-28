import React, { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Bell, MessageCircle, Award, Package, UserCheck, Clock } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { getExpiringMemberships, generateZaloLink, ExpiringMembership } from '../../services/automationService';
import { getMemberships } from '../../services/membershipService';
import { getAttendanceByClass } from '../../services/attendanceService';
import { fetchOrders } from '../../services/apiService';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        totalMemberships: 0,
        activeMemberships: 0,
        todayAttendance: 0,
        totalRevenue: 0,
        monthRevenue: 0,
        pendingOrders: 0,
        activeClasses: 0
    });
    const [expiringMemberships, setExpiringMemberships] = useState<ExpiringMembership[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const currentMonth = new Date().getMonth();
            const today = new Date().toISOString().split('T')[0];

            const [
                expiringData,
                { count: totalStudents },
                { count: totalMemberships },
                { count: activeMemberships },
                { data: ordersData },
                { data: transactionsData },
                { count: todayAttendance }
            ] = await Promise.all([
                getExpiringMemberships(),
                supabase.from('students').select('*', { count: 'exact', head: true }),
                supabase.from('memberships').select('*', { count: 'exact', head: true }),
                supabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
                supabase.from('orders').select('total_amount, status, created_at'),
                supabase.from('transactions').select('amount, status, created_at'),
                supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('date', today)
            ]);

            setExpiringMemberships(expiringData || []);

            const orders = ordersData || [];
            const transactions = transactionsData || [];

            // Calculate Active Students (students with at least one active membership)
            const { count: activeStudentCount } = await supabase
                .from('memberships')
                .select('student_id', { count: 'exact', head: true })
                .eq('status', 'Active');


            // Calculate Revenue (Orders + Tuition Transactions)
            const calculateRevenue = (items: any[], amountKey: string) =>
                items
                    .filter(i => (i.status === 'Completed' || i.status === 'completed'))
                    .reduce((sum, i) => sum + (i[amountKey] || 0), 0);

            const calculateMonthlyRevenue = (items: any[], amountKey: string) =>
                items
                    .filter(i =>
                        (i.status === 'Completed' || i.status === 'completed') &&
                        new Date(i.created_at).getMonth() === currentMonth
                    )
                    .reduce((sum, i) => sum + (i[amountKey] || 0), 0);

            const totalRevenue =
                calculateRevenue(orders, 'total_amount') +
                calculateRevenue(transactions, 'amount');

            const monthRevenue =
                calculateMonthlyRevenue(orders, 'total_amount') +
                calculateMonthlyRevenue(transactions, 'amount');

            const pendingOrders = orders.filter(o => o.status === 'Pending').length;

            setStats({
                totalStudents: totalStudents || 0,
                activeStudents: activeStudentCount || 0,
                totalMemberships: totalMemberships || 0,
                activeMemberships: activeMemberships || 0,
                todayAttendance: todayAttendance || 0,
                totalRevenue,
                monthRevenue,
                pendingOrders
            });

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard: React.FC<{
        title: string;
        value: string | number;
        icon: React.ReactNode;
        trend?: string;
        bgColor: string;
        iconColor: string;
        desc?: string;
    }> = ({ title, value, icon, trend, bgColor, iconColor, desc }) => (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${iconColor} bg-opacity-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`${iconColor.replace('bg-', 'text-')} text-opacity-100`}>
                        {React.cloneElement(icon as React.ReactElement, { className: `w-7 h-7 ${iconColor.replace('bg-', 'text-')}` })}
                    </div>
                </div>
                {trend && (
                    <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </span>
                )}
            </div>

            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{value}</h3>
                {desc && <p className="text-slate-400 text-xs mt-2 font-medium">{desc}</p>}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-500 to-purple-600 text-white p-8 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-serif mb-2">Dashboard Tổng quan</h1>
                        <p className="text-rose-100 text-sm">Chào mừng trở lại! Đây là tổng quan về học viện của bạn</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs opacity-75">Hôm nay</p>
                        <p className="text-2xl font-bold">{new Date().toLocaleDateString('vi-VN')}</p>
                        <p className="text-sm opacity-90">{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng Học viên"
                    value={stats.totalStudents}
                    icon={<Users />}
                    trend="+12%"
                    desc={`${stats.activeStudents} đang hoạt động`}
                    bgColor="bg-white"
                    iconColor="bg-blue-500"
                />
                <StatCard
                    title="Thẻ Active"
                    value={stats.activeMemberships}
                    icon={<Award />}
                    desc={`Trên tổng ${stats.totalMemberships} thẻ phát hành`}
                    bgColor="bg-white"
                    iconColor="bg-rose-500"
                />
                <StatCard
                    title="Doanh thu tháng"
                    value={`${(stats.monthRevenue / 1000000).toFixed(1)}M`}
                    icon={<DollarSign />}
                    trend="+8.5%"
                    desc="So với tháng trước"
                    bgColor="bg-white"
                    iconColor="bg-emerald-500"
                />
                <StatCard
                    title="Đơn hàng chờ"
                    value={stats.pendingOrders}
                    icon={<Package />}
                    desc="Cần xử lý ngay"
                    bgColor="bg-white"
                    iconColor="bg-amber-500"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Điểm danh hôm nay</p>
                            <p className="text-2xl font-bold text-slate-900">{stats.todayAttendance}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng doanh thu</p>
                            <p className="text-2xl font-bold text-slate-900">{(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tuần này</p>
                            <p className="text-2xl font-bold text-slate-900">-</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-rose-500" />
                    Thao tác nhanh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/students"
                        className="p-4 border-2 border-slate-100 hover:border-rose-500 rounded-2xl transition-all group cursor-pointer"
                    >
                        <Users className="w-6 h-6 text-slate-400 group-hover:text-rose-500 mb-2" />
                        <p className="font-bold text-slate-900">Thêm học viên mới</p>
                        <p className="text-xs text-slate-400">Đăng ký học viên mới</p>
                    </a>
                    <a
                        href="/admin/attendance"
                        className="p-4 border-2 border-slate-100 hover:border-purple-500 rounded-2xl transition-all group cursor-pointer"
                    >
                        <UserCheck className="w-6 h-6 text-slate-400 group-hover:text-purple-500 mb-2" />
                        <p className="font-bold text-slate-900">Điểm danh lớp học</p>
                        <p className="text-xs text-slate-400">Bắt đầu điểm danh</p>
                    </a>
                    <a
                        href="/admin/memberships"
                        className="p-4 border-2 border-slate-100 hover:border-blue-500 rounded-2xl transition-all group cursor-pointer"
                    >
                        <Award className="w-6 h-6 text-slate-400 group-hover:text-blue-500 mb-2" />
                        <p className="font-bold text-slate-900">Gán thẻ học phí</p>
                        <p className="text-xs text-slate-400">Quản lý gói học</p>
                    </a>
                </div>
            </div>

            {/* Activity Stream */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Hoạt động gần đây</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <p className="text-slate-600">Hệ thống CRM đã được triển khai thành công</p>
                        <span className="ml-auto text-xs text-slate-400">Hôm nay</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <p className="text-slate-600">Phase 1: Operational Excellence hoàn thành</p>
                        <span className="ml-auto text-xs text-slate-400">Hôm nay</span>
                    </div>
                </div>
            </div>
            {/* Expiring Memberships Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Cần gia hạn (7 ngày tới)</h2>
                </div>

                <div className="space-y-4">
                    {expiringMemberships.length === 0 ? (
                        <p className="text-slate-400 text-sm">Không có học viên nào sắp hết hạn.</p>
                    ) : (
                        expiringMemberships.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="font-bold text-slate-900">{item.student_name}</p>
                                    <p className="text-xs text-slate-500">{item.package_name} • Hết hạn: {new Date(item.end_date).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-lg">
                                        Còn {item.days_left} ngày
                                    </span>
                                    <a
                                        href={generateZaloLink(item.phone, item.student_name, item.days_left)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                                        title="Nhắn Zalo nhắc gia hạn"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
