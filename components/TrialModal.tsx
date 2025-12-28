import React, { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { createTrialBooking } from '../services/trialBookingService';
import { useToast } from '../contexts/ToastContext';

interface TrialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TrialModal: React.FC<TrialModalProps> = ({ isOpen, onClose }) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        class_interest: 'Ballet Cơ Bản',
        note: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTrialBooking({
                ...formData,
                status: 'Pending'
            });
            setSuccess(true);
            showToast('Đăng ký thành công!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Lỗi đăng ký. Vui lòng thử lại.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5 text-slate-500" />
                </button>

                {success ? (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Đăng ký thành công!</h2>
                        <p className="text-slate-500 mb-8">Cảm ơn bạn đã quan tâm. Chúng tôi sẽ liên hệ lại sớm nhất.</p>
                        <button
                            onClick={onClose}
                            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all"
                        >
                            Đóng
                        </button>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-serif font-bold text-slate-900">Đăng ký học thử</h2>
                            <p className="text-slate-400 text-sm mt-1">Trải nghiệm lớp Ballet chuẩn Royal Academy</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Họ tên *</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Số điện thoại *</label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Lớp quan tâm</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    value={formData.class_interest}
                                    onChange={(e) => setFormData({ ...formData, class_interest: e.target.value })}
                                >
                                    <option value="Ballet Cơ Bản">Ballet Cơ Bản</option>
                                    <option value="Ballet Trung Cấp">Ballet Trung Cấp</option>
                                    <option value="Contemporary">Contemporary</option>
                                    <option value="Kids Ballet">Kids Ballet</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gửi đăng ký'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrialModal;
