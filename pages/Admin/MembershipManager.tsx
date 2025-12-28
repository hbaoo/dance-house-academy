import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit2, Trash2, Search, Loader2, Calendar, User } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { getMemberships, createMembership, updateMembership, Membership } from '../../services/membershipService';
import { getStudents, Student } from '../../services/studentService';

const MembershipManager: React.FC = () => {
    const { showToast } = useToast();
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
    const [formData, setFormData] = useState<Partial<Membership>>({
        student_id: '',
        package_name: '',
        total_sessions: 0,
        remaining_sessions: 0,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'Active'
    });

    // Student lookup map
    const [studentMap, setStudentMap] = useState<Record<string, Student>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [membershipData, studentData] = await Promise.all([
                getMemberships(),
                getStudents()
            ]);
            setMemberships(membershipData);
            setStudents(studentData);

            // Create lookup map
            const map: Record<string, Student> = {};
            studentData.forEach(s => map[s.id] = s);
            setStudentMap(map);
        } catch (error) {
            showToast('Không thể tải dữ liệu', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMembership) {
                await updateMembership(editingMembership.id, formData);
                showToast('Cập nhật thẻ thành công', 'success');
            } else {
                await createMembership(formData);
                showToast('Thêm thẻ thành công', 'success');
            }
            loadData();
            closeModal();
        } catch (error) {
            showToast('Có lỗi xảy ra', 'error');
        }
    };

    const openModal = (membership?: Membership) => {
        if (membership) {
            setEditingMembership(membership);
            setFormData(membership);
        } else {
            setEditingMembership(null);
            setFormData({
                student_id: '',
                package_name: '',
                total_sessions: 0,
                remaining_sessions: 0,
                start_date: new Date().toISOString().split('T')[0],
                end_date: '',
                status: 'Active'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingMembership(null);
    };

    const handlePackageChange = (packageName: string) => {
        let sessions = 0;
        let endDate = '';
        const startDate = new Date(formData.start_date || new Date());

        switch (packageName) {
            case 'Tháng (8 buổi)':
                sessions = 8;
                endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                break;
            case 'Quý (24 buổi)':
                sessions = 24;
                endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                break;
            case 'Năm (96 buổi)':
                sessions = 96;
                endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                break;
            case '10 buổi':
                sessions = 10;
                break;
            case '20 buổi':
                sessions = 20;
                break;
        }

        setFormData({
            ...formData,
            package_name: packageName,
            total_sessions: sessions,
            remaining_sessions: editingMembership ? formData.remaining_sessions : sessions,
            end_date: endDate
        });
    };

    const filteredMemberships = memberships.filter(m => {
        const student = studentMap[m.student_id];
        return student?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.package_name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (isLoading) {
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
                        <CreditCard className="w-8 h-8 text-rose-500" />
                        Quản lý Thẻ học phí
                    </h1>
                    <p className="text-slate-400 mt-1">Tổng số: {memberships.length} thẻ</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Gán thẻ mới
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên học viên hoặc gói..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Memberships Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Học viên</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Gói học phí</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Buổi học</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Thời hạn</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMemberships.map((membership) => {
                                const student = studentMap[membership.student_id];
                                const usagePercent = (membership.remaining_sessions / membership.total_sessions) * 100;

                                return (
                                    <tr key={membership.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                    <User className="w-6 h-6 text-purple-500" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{student?.full_name || 'N/A'}</p>
                                                    <p className="text-xs text-slate-400">{student?.phone || ''}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                                                {membership.package_name}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {membership.remaining_sessions}/{membership.total_sessions} buổi
                                                    </p>
                                                </div>
                                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${usagePercent > 50 ? 'bg-green-500' :
                                                                usagePercent > 20 ? 'bg-yellow-500' :
                                                                    'bg-red-500'
                                                            }`}
                                                        style={{ width: `${usagePercent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1 text-xs text-slate-600">
                                                <p className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(membership.start_date).toLocaleDateString('vi-VN')}
                                                </p>
                                                {membership.end_date && (
                                                    <p className="text-slate-400">
                                                        → {new Date(membership.end_date).toLocaleDateString('vi-VN')}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${membership.status === 'Active' ? 'bg-green-100 text-green-600' :
                                                    membership.status === 'Expired' ? 'bg-red-100 text-red-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {membership.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(membership)}
                                                    className="p-2 hover:bg-blue-50 rounded-xl transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4 text-blue-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-2xl font-serif text-slate-900">
                                {editingMembership ? 'Chỉnh sửa thẻ' : 'Gán thẻ học phí mới'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Chọn học viên *</label>
                                <select
                                    required
                                    disabled={!!editingMembership}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    value={formData.student_id}
                                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                >
                                    <option value="">-- Chọn học viên --</option>
                                    {students.filter(s => s.status === 'Active').map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.full_name} ({student.phone})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Gói học phí *</label>
                                <select
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    value={formData.package_name}
                                    onChange={(e) => handlePackageChange(e.target.value)}
                                >
                                    <option value="">-- Chọn gói --</option>
                                    <option value="Tháng (8 buổi)">Tháng (8 buổi)</option>
                                    <option value="Quý (24 buổi)">Quý (24 buổi)</option>
                                    <option value="Năm (96 buổi)">Năm (96 buổi)</option>
                                    <option value="10 buổi">10 buổi</option>
                                    <option value="20 buổi">20 buổi</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Tổng buổi</label>
                                    <input
                                        type="number"
                                        disabled
                                        className="w-full bg-slate-100 border border-slate-100 rounded-2xl p-4 text-sm outline-none mt-2"
                                        value={formData.total_sessions}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Buổi còn lại</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.remaining_sessions}
                                        onChange={(e) => setFormData({ ...formData, remaining_sessions: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Ngày bắt đầu *</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Ngày hết hạn</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Trạng thái</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all"
                                >
                                    {editingMembership ? 'Cập nhật' : 'Tạo thẻ'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembershipManager;
