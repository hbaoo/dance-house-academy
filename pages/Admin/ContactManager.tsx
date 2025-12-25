
import React, { useState, useEffect } from 'react';
import { fetchContacts, deleteContact } from '../../services/apiService';
import { Contact } from '../../types';
import { Mail, Trash2, Clock, RefreshCw, Loader2, User } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const ContactManager: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const loadContacts = async () => {
        setLoading(true);
        try {
            const data = await fetchContacts();
            setContacts(data);
        } catch (error) {
            showToast("Không thể tải danh sách liên hệ", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) return;
        try {
            await deleteContact(id);
            showToast("Đã xóa tin nhắn", "success");
            loadContacts();
        } catch (error) {
            showToast("Xóa thất bại", "error");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-serif mb-2">Hộp thư Liên hệ</h2>
                    <p className="text-slate-400">Xem và quản lý tin nhắn từ khách hàng</p>
                </div>
                <button
                    onClick={loadContacts}
                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid gap-6">
                {loading && contacts.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 bg-white rounded-[40px] border border-slate-100 italic">
                        <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4 text-rose-500" />
                        Đang tải tin nhắn...
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 bg-white rounded-[40px] border border-slate-100 italic">
                        Hộp thư đang trống
                    </div>
                ) : (
                    contacts.map(contact => (
                        <div key={contact.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{contact.name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {contact.email}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(contact.created_at!).toLocaleString('vi-VN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl text-slate-600 leading-relaxed italic">
                                        "{contact.message}"
                                    </div>
                                </div>
                                <div className="flex items-start md:mt-2">
                                    <button
                                        onClick={() => handleDelete(contact.id!)}
                                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                        title="Xóa tin nhắn"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ContactManager;
