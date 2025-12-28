import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LogOut, ShoppingBag, Calendar, MessageSquare, Globe, Users,
    CreditCard, ArrowLeft, BadgeDollarSign, ClipboardCheck,
    LayoutDashboard, Package as PackageIcon, Newspaper, BarChart4,
    GraduationCap, BookOpen, UserPlus
} from 'lucide-react';

const MENU_GROUPS = [
    {
        label: 'Tổng quan',
        items: [
            { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
            { path: '/admin/reports', icon: BarChart4, label: 'Báo cáo' }
        ]
    },
    {
        label: 'Vận hành',
        items: [
            { path: '/admin/students', icon: GraduationCap, label: 'Học viên' },
            { path: '/admin/classes', icon: Calendar, label: 'Lớp học' },
            { path: '/admin/attendance', icon: ClipboardCheck, label: 'Điểm danh' },
            { path: '/admin/memberships', icon: UserPlus, label: 'Thẻ học phí' },
        ]
    },
    {
        label: 'Kinh doanh',
        items: [
            { path: '/admin/orders', icon: ShoppingBag, label: 'Đơn hàng Store' },
            { path: '/admin/transactions', icon: CreditCard, label: 'Giao dịch Gói học' },
            { path: '/admin/packages', icon: PackageIcon, label: 'Gói học (Public)' },
            { path: '/admin/products', icon: BookOpen, label: 'Sản phẩm Store' },
        ]
    },
    {
        label: 'Marketing & CRM',
        items: [
            { path: '/admin/leads', icon: Users, label: 'KH Tiềm năng' },
            { path: '/admin/news', icon: Newspaper, label: 'Tin tức' },
            { path: '/admin/contacts', icon: MessageSquare, label: 'Liên hệ' },
            { path: '/admin/settings', icon: Globe, label: 'Cài đặt Web' },
        ]
    }
];

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col pt-6 pb-4 overflow-hidden">
                <div className="px-6 mb-8">
                    <h1 className="text-2xl font-bold font-serif italic text-rose-400">Dance House</h1>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Admin Portal</p>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-8 no-scrollbar">
                    {MENU_GROUPS.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                {group.label}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium
                                            ${isActive
                                                ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/50'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`
                                        }
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="px-4 mt-4 pt-4 border-t border-slate-800 space-y-1">
                    <button onClick={() => navigate('/')} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full transition-colors rounded-xl hover:bg-slate-800">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium text-sm">Về Trang chủ</span>
                    </button>
                    <button onClick={() => {
                        localStorage.removeItem('isAdminAuthenticated');
                        navigate('/login');
                    }} className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-xl w-full transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium text-sm">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-50">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
