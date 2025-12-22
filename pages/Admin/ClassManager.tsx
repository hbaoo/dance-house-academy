
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';
import { DanceClass } from '../../types';
import { fetchClasses, addClass, deleteClass } from '../../services/apiService';

const ClassManager: React.FC = () => {
    const [classes, setClasses] = useState<DanceClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<DanceClass>>({
        title: '',
        time: '',
        duration: '',
        studio: '',
        age_range: '',
        instructor: { id: Date.now(), name: 'Giảng viên mới', role: 'Giáo viên', avatar: 'https://i.pravatar.cc/150' }
    });

    const loadData = async () => {
        setLoading(true);
        const data = await fetchClasses();
        setClasses(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa lớp học này?')) {
            await deleteClass(id);
            loadData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.time) return;

        await addClass(formData as DanceClass);
        setIsModalOpen(false);
        setFormData({ title: '', time: '', duration: '', studio: '', age_range: '', instructor: { id: Date.now(), name: 'Giảng viên mới', role: 'Giáo viên', avatar: 'https://i.pravatar.cc/150' } });
        loadData();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Quản lý Lớp học</h1>
                    <p className="text-slate-500 text-sm">Thêm, sửa và xóa các lớp học trong hệ thống.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-rose-500 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Thêm lớp mới
                </button>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Giờ học</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Tên lớp</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Phòng</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Đối tượng</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map(cls => (
                                <tr key={cls.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="p-6 font-medium text-rose-500">{cls.time} <span className="text-slate-400 text-xs ml-2 font-normal">({cls.duration})</span></td>
                                    <td className="p-6 font-serif text-lg">{cls.title}</td>
                                    <td className="p-6 text-sm text-slate-600">{cls.studio}</td>
                                    <td className="p-6 text-sm text-slate-600">{cls.age_range}</td>
                                    <td className="p-6 text-right">
                                        <button onClick={() => handleDelete(cls.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {classes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-400">Chưa có lớp học nào. Hãy thêm mới!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif">Thêm lớp học mới</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Giờ học</label>
                                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: 08:30 AM" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Thời lượng</label>
                                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: 60 MIN" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tên lớp học</label>
                                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: Ballet Cơ Bản" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Phòng học</label>
                                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: Phòng A1" value={formData.studio} onChange={e => setFormData({ ...formData, studio: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Độ tuổi</label>
                                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: 4-6 tuổi" value={formData.age_range} onChange={e => setFormData({ ...formData, age_range: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-rose-600 transition-all mt-4">
                                Lưu lớp học
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManager;
