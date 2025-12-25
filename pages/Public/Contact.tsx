import React, { useState } from 'react';
import SimplePage from '../../components/SimplePage';
import { MapPin, Mail, Phone, Clock, Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { createContact } from '../../services/apiService';

const Contact: React.FC = () => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            showToast("Vui lòng điền đầy đủ thông tin", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            await createContact(formData);
            setIsSubmitting(false);
            showToast(t('form_success'), 'success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            setIsSubmitting(false);
            showToast("Gửi lời nhắn thất bại. Vui lòng thử lại sau.", "error");
        }
    };

    return (
        <SimplePage title={t('contact_title')} subtitle={t('contact_subtitle')}>
            <div className="grid md:grid-cols-2 gap-12 not-prose">
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl serif mb-4">{t('contact_info')}</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-4 items-start">
                                <MapPin className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">{t('address_label')}</p>
                                    <p className="text-slate-500">123 Arabesque Ave, Brooklyn, NY 11211</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <Mail className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">{t('email_label')}</p>
                                    <p className="text-slate-500">hello@dancehouse.com</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <Phone className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">{t('hotline_label')}</p>
                                    <p className="text-slate-500">+84 (0) 90 123 4567</p>
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <Clock className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold">{t('hours_label')}</p>
                                    <p className="text-slate-500">{t('hours_value_1')}</p>
                                    <p className="text-slate-500">{t('hours_value_2')}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-[#FCF8F9] p-8 rounded-[40px] border border-rose-100">
                    <h3 className="text-2xl serif mb-6">{t('contact_form_title')}</h3>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t('form_name')}</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-12 rounded-xl bg-white px-4 border border-slate-200 outline-none focus:border-rose-300 transition-colors"
                                placeholder="Nguyễn Văn A"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t('form_email')}</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full h-12 rounded-xl bg-white px-4 border border-slate-200 outline-none focus:border-rose-300 transition-colors"
                                placeholder="email@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t('form_message')}</label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full h-32 rounded-xl bg-white p-4 border border-slate-200 outline-none focus:border-rose-300 transition-colors resize-none"
                                placeholder="Tôi muốn tìm hiểu về lớp học..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 text-white h-12 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-rose-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : t('form_submit')}
                        </button>
                    </form>
                </div>
            </div>
        </SimplePage>
    );
};

export default Contact;
