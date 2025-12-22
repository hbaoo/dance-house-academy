
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-bold uppercase tracking-widest text-slate-600"
            title="Switch Language"
        >
            <Globe className="w-3 h-3" />
            <span>{language === 'vi' ? 'VI' : 'EN'}</span>
        </button>
    );
};

export default LanguageSwitcher;
