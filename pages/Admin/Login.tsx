import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import { signIn } from '../../services/authService';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const from = (location.state as any)?.from?.pathname || '/admin';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const session = await signIn(email, password);
        if (session) {
            navigate(from, { replace: true });
        } else {
            setError('Email hoặc mật khẩu không đúng');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCF8F9] px-6">
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-rose-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-rose-500" />
                    </div>
                    <h1 className="text-3xl font-serif mb-2">Admin Portal</h1>
                    <p className="text-slate-400 text-sm">Đăng nhập để quản lý hệ thống</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-500 text-sm rounded-xl text-center font-medium">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Email</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                placeholder="Email"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                                placeholder="••••••"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2 group"
                    >
                        Đăng nhập <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <button onClick={() => navigate('/')} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
