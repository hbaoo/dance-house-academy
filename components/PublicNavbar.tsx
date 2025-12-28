import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Shield } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { useSettings } from '../contexts/SettingsContext';
import LanguageSwitcher from './LanguageSwitcher';
import TrialModal from './TrialModal';

const PublicNavbar: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { showToast } = useToast();
    const { settings } = useSettings();
    const [isTrialOpen, setIsTrialOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-rose-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-inherit no-underline">
                        {settings.site_logo ? (
                            <img src={settings.site_logo} alt={settings.site_name} className="h-8 w-auto object-contain" />
                        ) : (
                            <Sparkles className="text-rose-400 w-6 h-6" />
                        )}
                        <span className="text-2xl font-semibold italic serif text-slate-900">{settings.site_name || 'Dance House'}</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <Link to="/" className="hover:text-rose-500 transition-colors">{t('home')}</Link>
                        <a href="/#classes" className="hover:text-rose-500 transition-colors">{t('classes')}</a>
                        <a href="/#boutique" className="hover:text-rose-500 transition-colors">{t('boutique')}</a>
                        <Link to="/contact" className="hover:text-rose-500 transition-colors">{t('contact')}</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsTrialOpen(true)}
                            className="bg-rose-500 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                        >
                            Đăng ký học thử
                        </button>
                    </div>
                </div>
            </nav>
            <TrialModal isOpen={isTrialOpen} onClose={() => setIsTrialOpen(false)} />
        </>
    );
};

export default PublicNavbar;
