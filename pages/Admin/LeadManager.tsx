import React, { useEffect, useState } from 'react';
import { Users, Search, Loader2, Phone, Calendar, MessageCircle, CheckCircle2, XCircle } from 'lucide-react';
import { getTrialBookings, updateTrialStatus, TrialBooking } from '../../services/trialBookingService';
import { useToast } from '../../contexts/ToastContext';
import { generateZaloLink } from '../../services/automationService';

const LeadManager: React.FC = () => {
    const { showToast } = useToast();
    const [leads, setLeads] = useState<TrialBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            const data = await getTrialBookings();
            setLeads(data);
        } catch (error) {
            showToast('Không thể tải danh sách (leads)', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateTrialStatus(id, newStatus);
            showToast('Cập nhật trạng thái thành công', 'success');
            loadLeads();
        } catch (error) {
            showToast('Lỗi cập nhật', 'error');
        }
    };

    const filteredLeads = leads.filter(l =>
        l.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.phone.includes(searchQuery)
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
                        Quản lý KH Tiềm năng
                    </h1>
                    <p className="text-slate-400 mt-1">Danh sách đăng ký học thử</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, số điện thoại..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Khách hàng</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Quan tâm</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày đăng ký</th>
                                <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="text-right p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900">{lead.full_name}</div>
                                        <div className="text-sm text-slate-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {lead.phone}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold">
                                            {lead.class_interest}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(lead.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                                            className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-lg border-none outline-none cursor-pointer
                                                ${lead.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                                                    lead.status === 'Contacted' ? 'bg-blue-100 text-blue-600' :
                                                        lead.status === 'Converted' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                        >
                                            <option value="Pending">Mới</option>
                                            <option value="Contacted">Đã liên hệ</option>
                                            <option value="Converted">Đã đăng ký</option>
                                            <option value="Cancelled">Hủy</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <a
                                                href={generateZaloLink(lead.phone, lead.full_name, 0).replace('sắp hết hạn sau 0 ngày nữa. Bạn nhớ gia hạn sớm để giữ ưu đãi nhé', 'mình thấy bạn quan tâm lớp học bên Dance House, mình tư vấn cho bạn nhé')}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                                                title="Chat Zalo"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeadManager;
