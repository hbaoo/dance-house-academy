
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, X, Edit2 } from 'lucide-react';
import { Product } from '../../types';
import { fetchProducts, addProduct, deleteProduct, updateProduct } from '../../services/apiService';
import { useToast } from '../../contexts/ToastContext';

const ProductManager: React.FC = () => {
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        price: 0,
        image: '',
        badge: ''
    });

    const loadData = async () => {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            try {
                await deleteProduct(id);
                showToast("Đã xóa sản phẩm", "info");
                loadData();
            } catch (error) {
                showToast("Lỗi khi xóa sản phẩm", "error");
            }
        }
    };

    const handleEdit = (prod: Product) => {
        setEditingProduct(prod);
        setFormData({
            name: prod.name,
            price: prod.price,
            image: prod.image,
            badge: prod.badge || ''
        });
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: 0, image: '', badge: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, formData);
                showToast("Đã cập nhật sản phẩm thành công", "success");
            } else {
                const productToAdd = {
                    ...formData,
                    image: formData.image || 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=800'
                };
                await addProduct(productToAdd as Product);
                showToast("Đã thêm sản phẩm mới", "success");
            }

            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', price: 0, image: '', badge: '' });
            loadData();
        } catch (error) {
            showToast("Có lỗi xảy ra, vui lòng thử lại", "error");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Quản lý Cửa hàng</h1>
                    <p className="text-slate-500 text-sm">Thêm, sửa và xóa các sản phẩm trong boutique.</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-rose-500 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" /> Thêm sản phẩm
                </button>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-rose-500 w-8 h-8" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(prod => (
                        <div key={prod.id} className="group bg-white rounded-3xl p-4 border border-slate-100 hover:shadow-xl transition-all relative">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4 relative">
                                <img src={prod.image} className="w-full h-full object-cover" alt={prod.name} />
                                {prod.badge && (
                                    <span className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        {prod.badge}
                                    </span>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => handleEdit(prod)}
                                        className="bg-white/90 p-2 rounded-full text-slate-500 hover:text-rose-500 hover:bg-white shadow-sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prod.id)}
                                        className="bg-white/90 p-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-white shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-serif text-lg mb-1">{prod.name}</h3>
                            <p className="text-rose-500 font-bold text-sm">{prod.price.toLocaleString('vi-VN')} VND</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif">{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tên sản phẩm</label>
                                <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: Giày Múa Mới" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Giá (VND)</label>
                                <input type="number" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: 500000" value={formData.price || ''} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">URL Hình ảnh</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Nhãn (Tùy chọn)</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="VD: NEW, SALE" value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-rose-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-rose-600 transition-all mt-4">
                                Lưu sản phẩm
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
