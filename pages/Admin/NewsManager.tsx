
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, Eye, EyeOff, Calendar } from 'lucide-react'; // Removed duplicate Eye
import { useToast } from '../../contexts/ToastContext';
import { fetchNews, createNews, updateNews, deleteNews } from '../../services/newsService';
import { News } from '../../types';

const NewsManager: React.FC = () => {
    const { showToast } = useToast();
    const [newsList, setNewsList] = useState<News[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);

    const [formData, setFormData] = useState<Partial<News>>({
        title: '',
        content: '',
        summary: '',
        image_url: '',
        is_visible: true,
        published_at: new Date().toISOString()
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchNews();
            setNewsList(data);
        } catch (error) {
            console.error(error);
            showToast('Không thể tải tin tức', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingNews) {
                await updateNews(editingNews.id, formData);
                showToast('Cập nhật tin tức thành công', 'success');
            } else {
                await createNews(formData);
                showToast('Đăng tin thành công', 'success');
            }
            loadData();
            closeModal();
        } catch (error) {
            showToast('Có lỗi xảy ra', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa tin này?')) return;
        try {
            await deleteNews(id);
            showToast('Đã xóa tin tức', 'success');
            loadData();
        } catch (error) {
            showToast('Không thể xóa', 'error');
        }
    };

    const openModal = (news?: News) => {
        if (news) {
            setEditingNews(news);
            setFormData(news);
        } else {
            setEditingNews(null);
            setFormData({
                title: '',
                content: '',
                summary: '',
                image_url: '',
                is_visible: true,
                published_at: new Date().toISOString()
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNews(null);
    };

    const filteredNews = newsList.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-rose-500" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-serif text-slate-900">Quản lý Tin tức</h1>
                    <p className="text-slate-400 mt-1">Đăng bài viết & Thông báo mới</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    Viết bài mới
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filteredNews.map(news => (
                    <div key={news.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-rose-100 transition-all flex gap-6 items-start">
                        <img
                            src={news.image_url || 'https://via.placeholder.com/150'}
                            alt={news.title}
                            className="w-32 h-24 object-cover rounded-xl bg-slate-100"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{news.title}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">{news.summary || news.content.substring(0, 100)}...</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(news)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(news.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(news.published_at).toLocaleDateString('vi-VN')}
                                </span>
                                <span className={`flex items-center gap-1 ${news.is_visible ? 'text-green-500' : 'text-slate-400'}`}>
                                    {news.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    {news.is_visible ? 'Công khai' : 'Ẩn'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-2xl font-serif text-slate-900">
                                {editingNews ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Tiêu đề *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Tóm tắt (Hiện ở danh sách)</label>
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    rows={2}
                                    value={formData.summary || ''}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nội dung * (HTML/Text)</label>
                                <textarea
                                    required
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2 font-mono"
                                    rows={10}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 mt-1 pl-1">Bạn có thể dùng thẻ HTML cơ bản nếu muốn trang trí.</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Link Ảnh bìa</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all mt-2"
                                    value={formData.image_url || ''}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-rose-500"
                                        checked={formData.is_visible}
                                        onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                                    />
                                    <span className="text-sm font-bold text-slate-600">Hiển thị công khai</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">
                                    Hủy
                                </button>
                                <button type="submit" className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all">
                                    {editingNews ? 'Cập nhật' : 'Đăng bài'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsManager;
