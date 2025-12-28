
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types';
import { LogOut, Calendar, CreditCard, User } from 'lucide-react';

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState<Student | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('student_user');
        if (!stored) {
            navigate('/student/login');
            return;
        }
        setStudent(JSON.parse(stored));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('student_user');
        navigate('/student/login');
    };

    if (!student) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Xin chào,</p>
                        <h1 className="text-xl font-serif text-slate-900 font-bold">{student.full_name}</h1>
                    </div>
                    <button onClick={handleLogout} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="max-w-md mx-auto px-6 py-8 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rose-500 text-white p-5 rounded-3xl shadow-lg shadow-rose-500/30">
                        <CreditCard className="w-6 h-6 mb-3 opacity-80" />
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Thẻ học</p>
                        <p className="text-2xl font-bold">VIP Member</p>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                        <Calendar className="w-6 h-6 mb-3 text-purple-500" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Lịch học</p>
                        <p className="text-lg font-bold text-slate-900">Thứ 2 - 4 - 6</p>
                    </div>
                </div>

                {/* Next Class */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-serif font-bold mb-4">Lớp học sắp tới</h2>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="bg-white w-14 h-14 rounded-xl flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                            <span className="text-xs font-bold text-rose-500 uppercase">T2</span>
                            <span className="text-lg font-bold text-slate-900">18</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Ballet Cơ Bản (Adults)</h3>
                            <p className="text-xs text-slate-500">18:30 - Studio 1 • Ms. Minh Thư</p>
                        </div>
                    </div>
                </div>

                {/* Empty State / Coming Soon */}
                <div className="text-center py-10">
                    <p className="text-slate-400 text-sm">Các tính năng khác đang được cập nhật...</p>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
