import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Loader2, UserCircle2, Calendar, Phone, Mail, KeyRound } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { getStudents, createStudent, updateStudent, deleteStudent, updateStudentPassword, Student } from '../../services/studentService';

const StudentManager: React.FC = () => {
    const { showToast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState<Partial<Student>>({
        medical_note: '',
        status: 'Active'
    });

    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Password Reset State
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordStudent, setPasswordStudent] = useState<Student | null>(null);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            showToast('Không thể tải danh sách học viên', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await updateStudent(editingStudent.id, formData);
                showToast('Cập nhật học viên thành công', 'success');
            } else {
                // Remove password from formData before sending to createStudent (it expects Partial<Student>, but password logic is separate or needs cleanup)
                // Actually our createStudent just takes Partial<Student>, but API ignores fields it doesn't know in the INSERT list if not in schema... 
                // Wait, 'password' column IS in schema now. BUT we want to hash it. 
                // Our createStudent uses .insert([student]), which sends raw password text if we leave it in formData.
                // WE MUST NOT send raw password to the column if we want to use the RPC hashing logic.
                // OR we update createStudent to handle it.
                // SAFEST: Clone formData, remove password, create student, THEN set password properly.

                const { password, ...studentData } = formData;
                const newStudent = await createStudent(studentData);

                let initialPassword = password;
                if (!initialPassword && studentData.phone) {
                    initialPassword = studentData.phone; // Default to phone if empty
                }

                if (initialPassword && newStudent?.id) {
                    await updateStudentPassword(newStudent.id, initialPassword);
                }

                showToast('Thêm học viên thành công', 'success');
            }
            loadStudents();
            closeModal();
        } catch (error) {
            showToast('Có lỗi xảy ra', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa học viên này?')) return;
        try {
            await deleteStudent(id);
            showToast('Xóa học viên thành công', 'success');
            loadStudents();
        } catch (error) {
            showToast('Không thể xóa học viên', 'error');
        }
    };

    const openModal = (student?: Student) => {
        if (student) {
            setEditingStudent(student);
            setFormData(student);
        } else {
            setEditingStudent(null);
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                birthdate: '',
                gender: '',
                level: 'Beginner',
                parent_name: '',
                emergency_contact: '',
                medical_note: '',
                status: 'Active'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    const openPasswordModal = (student: Student) => {
        setPasswordStudent(student);
        setNewPassword('');
        setIsPasswordModalOpen(true);
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordStudent || !newPassword) return;

        try {
            await updateStudentPassword(passwordStudent.id, newPassword);
            showToast(`Đã đổi mật khẩu cho ${passwordStudent.full_name}`, 'success');
            setIsPasswordModalOpen(false);
            setPasswordStudent(null);
        } catch (error) {
            showToast('Lỗi khi đổi mật khẩu', 'error');
            console.error(error);
        }
    };

    const filteredStudents = students.filter(s =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery)
    );

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
                        <Users className="w-8 h-8 text-rose-500" />
                        Quản lý Học viên
                    </h1>
                    <p className="text-slate-400 mt-1">Tổng số: {students.length} học viên</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Thêm học viên
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Học viên</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Liên hệ</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Trình độ</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày nhập học</th>
                                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                                                <UserCircle2 className="w-6 h-6 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{student.full_name}</p>
                                                {student.birthdate && (
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(student.birthdate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            {student.phone && (
                                                <p className="text-sm text-slate-600 flex items-center gap-2">
                                                    <Phone className="w-3 h-3" />
                                                    {student.phone}
                                                </p>
                                            )}
                                            {student.email && (
                                                <p className="text-sm text-slate-600 flex items-center gap-2">
                                                    <Mail className="w-3 h-3" />
                                                    {student.email}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-600">
                                            {student.level || 'Beginner'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-600' :
                                            student.status === 'Paused' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {student.join_date ? new Date(student.join_date).toLocaleDateString('vi-VN') : '-'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openModal(student)}
                                                className="p-2 hover:bg-blue-50 rounded-xl transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4 text-blue-500" />
                                            </button>
                                            <button
                                                onClick={() => openPasswordModal(student)}
                                                className="p-2 hover:bg-yellow-50 rounded-xl transition-colors"
                                                title="Đổi mật khẩu"
                                            >
                                                <KeyRound className="w-4 h-4 text-yellow-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-2xl font-serif text-slate-900">
                                {editingStudent ? 'Chỉnh sửa học viên' : 'Thêm học viên mới'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-2xl mb-4 text-sm text-blue-700">
                                <strong>Lưu ý:</strong> Mật khẩu mặc định sẽ là số điện thoại nếu bạn không nhập vào ô mật khẩu bên dưới.
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Họ tên *</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Mật khẩu (Tùy chọn)</label>
                                    <input
                                        type="text"
                                        placeholder="Mặc định là SĐT"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.password || ''}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Số điện thoại</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Ngày sinh</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.birthdate}
                                        onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Giới tính</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Trình độ</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Pre-Intermediate">Pre-Intermediate</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Trạng thái</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Đang học</option>
                                        <option value="Paused">Nghỉ tạm thời</option>
                                        <option value="Inactive">Đã nghỉ</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Tên phụ huynh</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.parent_name}
                                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Liên hệ khẩn cấp</label>
                                    <input
                                        placeholder="Tên + SĐT"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                        value={formData.emergency_contact}
                                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Lưu ý y tế</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2 h-24 resize-none"
                                        value={formData.medical_note}
                                        onChange={(e) => setFormData({ ...formData, medical_note: e.target.value })}
                                    />
                                </div>
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
                                    {editingStudent ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Reset Modal */}
            {isPasswordModalOpen && passwordStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <KeyRound className="w-8 h-8 text-yellow-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Cấp lại mật khẩu</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Đặt mật khẩu mới cho học viên <br />
                                <span className="font-bold text-slate-900">{passwordStudent.full_name}</span>
                            </p>
                        </div>

                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Mật khẩu mới</label>
                                <input
                                    type="text"
                                    autoFocus
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-lg font-bold text-center outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all mt-2"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới..."
                                />
                                <div className="flex justify-center gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewPassword(passwordStudent.phone)}
                                        className="text-xs text-rose-500 font-bold hover:underline"
                                    >
                                        Dùng số điện thoại làm mật khẩu
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="flex-1 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-yellow-500 transition-all"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManager;
