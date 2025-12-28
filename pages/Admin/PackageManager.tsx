
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Loader2, X, Package as PackageIcon } from 'lucide-react';
import { Package } from '../../types';
import { fetchPackages, addPackage, deletePackage, updatePackage } from '../../services/apiService';
import { useToast } from '../../contexts/ToastContext';

const PackageManager: React.FC = () => {
    const { showToast } = useToast();
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Package>>({
        name: '',
        description: '',
        total_sessions: 8,
        price: 0,
        duration_days: 30,
        is_active: true,
        display_order: 1
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchPackages();
            setPackages(data);
        } catch (error) {
            showToast("Lỗi khi tải danh sách gói học", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc muốn xóa gói học này?')) {
            try {
                await deletePackage(id);
                showToast("Đã xóa gói học", "success");
                loadData();
            } catch (error) {
                showToast("Lỗi khi xóa gói học", "error");
            }
        }
    };

    const handleEdit = (pkg: Package) => {
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            description: pkg.description,
            total_sessions: pkg.total_sessions,
            price: pkg.price,
            duration_days: pkg.duration_days,
            is_active: pkg.is_active,
            display_order: pkg.display_order
        });
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingPackage(null);
        setFormData({
            name: '',
            description: '',
            total_sessions: 8,
            price: 0,
            duration_days: 30,
            is_active: true,
            display_order: packages.length + 1
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        try {
            if (editingPackage) {
                await updatePackage(editingPackage.id, formData);
                showToast("Đã cập nhật gói học thành công", "success");
            } else {
                await addPackage(formData as Package);
                showToast("Đã thêm gói học mới", "success");
            }

            setIsModalOpen(false);
            setEditingPackage(null);
            loadData();
        } catch (error) {
            showToast("Có lỗi xảy ra, vui lòng thử lại", "error");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Quản lý Gói học</h1>
                    <p className="text-slate-500 text-sm">Cài đặt các gói học phí, thẻ thành viên bán cho học viên.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-rose-500 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Thêm gói mới
                </button>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Tên gói</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Số buổi</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Thời hạn</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Giá tiền (VNĐ)</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Trạng thái</th>
                                <th className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map(pkg => (
                                <tr key={pkg.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="p-6">
                                        <p className="font-serif text-lg text-slate-900">{pkg.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                                    </td>
                                    <td className="p-6 font-medium text-slate-700">{pkg.total_sessions} buổi</td>
                                    <td className="p-6 text-sm text-slate-600">{pkg.duration_days ? `${pkg.duration_days} ngày` : 'Không giới hạn'}</td>
                                    <td className="p-6 font-bold text-rose-500">{pkg.price.toLocaleString()}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${pkg.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {pkg.is_active ? 'Đang bán' : 'Tạm ẩn'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(pkg)} className="text-slate-400 hover:text-rose-500 p-2 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(pkg.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {packages.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-400">Chưa có gói học nào. Hãy thêm mới!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif">{editingPackage ? 'Chỉnh sửa gói học' : 'Thêm gói học mới'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tên gói học</label>
                                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: Gói Tháng" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Mô tả ngắn</label>
                                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none h-20" placeholder="VD: Lý tưởng cho người mới..." value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Số buổi học</label>
                                    <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={formData.total_sessions} onChange={e => setFormData({ ...formData, total_sessions: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Thời hạn (Ngày)</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Để trống nếu vô hạn" value={formData.duration_days || ''} onChange={e => setFormData({ ...formData, duration_days: e.target.value ? Number(e.target.value) : undefined })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Giá tiền (VNĐ)</label>
                                    <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Thứ tự hiển thị</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="w-5 h-5 text-rose-500 rounded focus:ring-rose-500 border-gray-300"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Đang hoạt động (Hiển thị trên web)</label>
                            </div>

                            <button type="submit" className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-rose-600 transition-all mt-4">
                                {editingPackage ? "Lưu thay đổi" : "Thêm gói học"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackageManager;
