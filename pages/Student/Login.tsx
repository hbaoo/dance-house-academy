
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { useToast } from '../../contexts/ToastContext';

const StudentLogin: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Call the secure RPC function
            const { data, error } = await supabase
                .rpc('student_login', {
                    phone_input: phone,
                    password_input: password
                });

            if (error) throw error;

            if (data) {
                // Success
                localStorage.setItem('student_user', JSON.stringify(data));
                showToast(`Xin chào ${data.full_name}!`, 'success');
                navigate('/student/dashboard');
            } else {
                showToast('Số điện thoại hoặc mật khẩu không đúng', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Lỗi đăng nhập. Vui lòng thử lại.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCF8F9] px-6">
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-rose-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-8 h-8 text-rose-500" />
                    </div>
                    <h1 className="text-3xl font-serif mb-2">Học viên</h1>
                    <p className="text-slate-400 text-sm">Đăng nhập để xem lịch học & thông báo</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Số điện thoại</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-900"
                                placeholder="0912..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Mật khẩu</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-900"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Đăng nhập <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
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

export default StudentLogin;
