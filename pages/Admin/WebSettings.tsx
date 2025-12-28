import React, { useState, useEffect } from 'react';
import { Globe, Save, Loader2, Image as ImageIcon, Phone, Mail, MapPin, Facebook, Instagram, Music2, Share2, CreditCard } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useSettings } from '../../contexts/SettingsContext';
import { updateMultipleSettings, WebSettings } from '../../services/settingsService';
import { uploadImage } from '../../services/apiService';

const WebSettingsPage: React.FC = () => {
    const { showToast } = useToast();
    const { settings: globalSettings, isLoading: isContextLoading, refreshSettings } = useSettings();
    const [settings, setSettings] = useState<WebSettings>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isContextLoading && globalSettings) {
            setSettings(globalSettings);
        }
    }, [globalSettings, isContextLoading]);

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = async (key: string, file: File) => {
        try {
            const url = await uploadImage(file);
            handleChange(key, url);
            showToast('Tải ảnh lên thành công', 'success');
        } catch (error) {
            showToast('Lỗi khi tải ảnh lên', 'error');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateMultipleSettings(settings);
            await refreshSettings();
            showToast('Đã lưu thay đổi thành công', 'success');
        } catch (error) {
            showToast('Lỗi khi lưu cài đặt', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isContextLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-serif text-slate-900 flex items-center gap-3">
                        <Globe className="w-8 h-8 text-rose-500" />
                        Cài đặt Website
                    </h1>
                    <p className="text-slate-400 mt-1">Quản lý nhận diện thương hiệu và thông tin liên hệ</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Lưu Thay Đổi
                </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Brand Identity */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                        <ImageIcon className="w-5 h-5 text-rose-500" />
                        <h2 className="text-xl font-bold text-slate-900">Nhận diện Thương hiệu</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Tên Website</label>
                            <input
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                value={settings.site_name || ''}
                                onChange={e => handleChange('site_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Logo Website</label>
                            <div className="flex gap-4 items-center">
                                <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden shrink-0">
                                    {settings.site_logo ? (
                                        <img src={settings.site_logo} alt="Logo Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-slate-200" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        id="logo-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={e => e.target.files?.[0] && handleFileUpload('site_logo', e.target.files[0])}
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-500 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        Chọn Logo mới
                                    </label>
                                    <p className="text-[10px] text-slate-400 mt-2 italic">Dịnh dạng: PNG, JPG (Khuyên dùng: Nền trong suốt)</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Ảnh Header (Hero Section)</label>
                            <div className="space-y-4">
                                {settings.header_image && (
                                    <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                                        <img src={settings.header_image} alt="Header Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div>
                                    <input
                                        type="file"
                                        id="header-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={e => e.target.files?.[0] && handleFileUpload('header_image', e.target.files[0])}
                                    />
                                    <label
                                        htmlFor="header-upload"
                                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-rose-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        Tải ảnh Header lên
                                    </label>
                                    <p className="text-[10px] text-slate-400 mt-2 italic">Dịnh dạng: JPG, WEBP (Kích thước khuyên dùng: 2000x1200px)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                        <Phone className="w-5 h-5 text-rose-500" />
                        <h2 className="text-xl font-bold text-slate-900">Thông tin Liên hệ</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Số điện thoại</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                    <input
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                        value={settings.contact_phone || ''}
                                        onChange={e => handleChange('contact_phone', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                    <input
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                        value={settings.contact_email || ''}
                                        onChange={e => handleChange('contact_email', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Địa chỉ Trụ sở</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium h-24 resize-none"
                                    value={settings.contact_address || ''}
                                    onChange={e => handleChange('contact_address', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                        <Share2 className="w-5 h-5 text-rose-500" />
                        <h2 className="text-xl font-bold text-slate-900">Mạng xã hội & Bản đồ</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Facebook URL</label>
                            <div className="relative">
                                <Facebook className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                <input
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                    value={settings.facebook_url || ''}
                                    onChange={e => handleChange('facebook_url', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Instagram URL</label>
                            <div className="relative">
                                <Instagram className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                <input
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                    value={settings.instagram_url || ''}
                                    onChange={e => handleChange('instagram_url', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Google Maps Embed URL</label>
                            <input
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                placeholder="https://www.google.com/maps/embed?..."
                                value={settings.google_maps_link || ''}
                                onChange={e => handleChange('google_maps_link', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Information */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                        <CreditCard className="w-5 h-5 text-rose-500" />
                        <h2 className="text-xl font-bold text-slate-900">Thông tin Ngân hàng (VietQR)</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Ngân hàng</label>
                                <input
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                    placeholder="VCB, MB, TCB..."
                                    value={settings.bank_id || ''}
                                    onChange={e => handleChange('bank_id', e.target.value)}
                                />
                                <p className="text-[10px] text-slate-400 pl-1">Mã ngân hàng (VD: VCB, MB, TCB, ACB...)</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Số tài khoản</label>
                                <input
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                    placeholder="0123456789"
                                    value={settings.bank_account_no || ''}
                                    onChange={e => handleChange('bank_account_no', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Tên chủ tài khoản</label>
                            <input
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium"
                                placeholder="DANCE HOUSE ACADEMY"
                                value={settings.bank_account_name || ''}
                                onChange={e => handleChange('bank_account_name', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced / Preview */}
                <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 shadow-sm space-y-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                        <Music2 className="w-5 h-5 text-rose-500" />
                        <h2 className="text-xl font-bold">Xem trước Web Identity</h2>
                    </div>

                    <div className="space-y-6 relative">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center p-2 border border-white/10">
                                <img src={settings.site_logo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif italic text-rose-400">{settings.site_name}</h3>
                                <p className="text-xs text-slate-400">Premium Ballet Academy</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Contact Preview</p>
                            <div className="text-sm space-y-1">
                                <p className="text-slate-300">📞 {settings.contact_phone}</p>
                                <p className="text-slate-300">📧 {settings.contact_email}</p>
                                <p className="text-slate-300 text-xs mt-2 italic text-slate-500">{settings.contact_address}</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="w-full h-24 rounded-2xl overflow-hidden border border-white/10 grayscale opacity-50 group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                                <img src={settings.header_image} alt="Hero" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default WebSettingsPage;
