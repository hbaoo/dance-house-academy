import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Loader2, Search, UserCheck, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { getAttendanceByClass, checkInStudent } from '../../services/attendanceService';
import { getStudents, Student } from '../../services/studentService';
import { getMemberships, Membership } from '../../services/membershipService';
import { fetchClasses } from '../../services/apiService';
import { DanceClass } from '../../types';

interface StudentWithMembership extends Student {
    membership?: Membership;
    hasAttendedToday?: boolean;
}

const AttendanceManager: React.FC = () => {
    const { showToast } = useToast();
    const [classes, setClasses] = useState<DanceClass[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [students, setStudents] = useState<StudentWithMembership[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [todayDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadClasses();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            loadStudentsForClass();
        }
    }, [selectedClassId]);

    const loadClasses = async () => {
        try {
            const data = await fetchClasses();
            setClasses(data);
        } catch (error) {
            showToast('Không thể tải danh sách lớp', 'error');
        }
    };

    const loadStudentsForClass = async () => {
        if (!selectedClassId) return;

        setIsLoading(true);
        try {
            const [allStudents, allMemberships, todayAttendance] = await Promise.all([
                getStudents(),
                getMemberships(),
                getAttendanceByClass(selectedClassId, todayDate)
            ]);

            // Filter active students only
            const activeStudents = allStudents.filter(s => s.status === 'Active');

            // Map students with their memberships
            const studentsWithMemberships: StudentWithMembership[] = activeStudents.map(student => {
                const activeMembership = allMemberships.find(
                    m => m.student_id === student.id &&
                        m.status === 'Active' &&
                        m.remaining_sessions > 0
                );

                const hasAttended = todayAttendance.some(a => a.student_id === student.id);

                return {
                    ...student,
                    membership: activeMembership,
                    hasAttendedToday: hasAttended
                };
            });

            setStudents(studentsWithMemberships);
        } catch (error) {
            showToast('Không thể tải danh sách học viên', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckIn = async (student: StudentWithMembership) => {
        if (!selectedClassId) return;

        if (student.hasAttendedToday) {
            showToast('Học viên đã điểm danh hôm nay', 'error');
            return;
        }

        if (!student.membership) {
            showToast('Học viên chưa có thẻ học phí', 'error');
            return;
        }

        if (student.membership.remaining_sessions <= 0) {
            showToast('Thẻ học phí đã hết buổi', 'error');
            return;
        }

        try {
            await checkInStudent(student.id, selectedClassId, student.membership.id);
            showToast(`Điểm danh thành công: ${student.full_name}`, 'success');
            loadStudentsForClass();
        } catch (error) {
            showToast('Lỗi khi điểm danh', 'error');
        }
    };

    const filteredStudents = students.filter(s =>
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone?.includes(searchQuery)
    );

    const selectedClass = classes.find(c => c.id === selectedClassId);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="w-8 h-8 text-rose-500" />
                    <div>
                        <h1 className="text-3xl font-serif text-slate-900">Điểm danh Học viên</h1>
                        <p className="text-slate-400 text-sm mt-1">Ngày: {new Date(todayDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                </div>

                {/* Class Selection */}
                <div className="mt-6">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Chọn lớp học</label>
                    <select
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                        value={selectedClassId || ''}
                        onChange={(e) => setSelectedClassId(Number(e.target.value) || null)}
                    >
                        <option value="">-- Chọn lớp --</option>
                        {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                                {cls.title} - {cls.time} ({cls.studio})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedClassId && (
                <>
                    {/* Class Info Card */}
                    {selectedClass && (
                        <div className="bg-gradient-to-br from-rose-500 to-purple-600 text-white p-6 rounded-3xl shadow-lg">
                            <h2 className="text-2xl font-serif mb-2">{selectedClass.title}</h2>
                            <div className="flex gap-6 text-sm opacity-90">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {selectedClass.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    {selectedClass.duration}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="relative">
                            <Search className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm học viên..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Students List */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-100">
                                <p className="text-sm font-bold text-slate-600">
                                    Tổng số: {filteredStudents.length} học viên
                                    <span className="ml-4 text-green-600">
                                        Đã điểm danh: {filteredStudents.filter(s => s.hasAttendedToday).length}
                                    </span>
                                </p>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {filteredStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        className={`p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors ${student.hasAttendedToday ? 'bg-green-50/30' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${student.hasAttendedToday ? 'bg-green-100' : 'bg-slate-100'
                                                }`}>
                                                {student.hasAttendedToday ? (
                                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                ) : (
                                                    <UserCheck className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900">{student.full_name}</p>
                                                <div className="flex gap-4 text-xs text-slate-500 mt-1">
                                                    <span>{student.phone}</span>
                                                    <span className={`px-2 py-0.5 rounded-full ${student.membership
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-red-100 text-red-600'
                                                        }`}>
                                                        {student.membership
                                                            ? `${student.membership.remaining_sessions}/${student.membership.total_sessions} buổi`
                                                            : 'Chưa có thẻ'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleCheckIn(student)}
                                            disabled={student.hasAttendedToday || !student.membership}
                                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${student.hasAttendedToday
                                                ? 'bg-green-100 text-green-600 cursor-not-allowed'
                                                : !student.membership
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg'
                                                }`}
                                        >
                                            {student.hasAttendedToday ? 'Đã điểm danh' : 'Điểm danh'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {!selectedClassId && (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                    <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Vui lòng chọn lớp học để bắt đầu điểm danh</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceManager;
