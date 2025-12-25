
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, ShoppingBag, LogOut, ArrowLeft, CreditCard } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-8 border-b border-slate-800">
                    <h1 className="text-2xl font-bold font-serif italic text-rose-400">Dance House</h1>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Admin Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/admin/classes"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium text-sm">Quản lý Lớp học</span>
                    </NavLink>
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-medium text-sm">Quản lý Sản phẩm</span>
                    </NavLink>
                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <CreditCard className="w-5 h-5" />
                        <span className="font-medium text-sm">Quản lý Đơn hàng</span>
                    </NavLink>
                </nav>


                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button onClick={() => navigate('/')} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">Về Trang chủ</span>
                    </button>
                    <button onClick={() => {
                        // Determine if we need to call logout from a service or just clear locally
                        localStorage.removeItem('isAdminAuthenticated');
                        navigate('/login');
                    }} className="flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-white hover:bg-rose-500/10 rounded-xl w-full transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
