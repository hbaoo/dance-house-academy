
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Mail, Phone } from 'lucide-react';

import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext';

const PublicFooter: React.FC = () => {
    const { t } = useLanguage();
    const { settings } = useSettings();

    return (
        <footer id="contact" className="bg-slate-900 text-white pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-20">
                <div className="md:col-span-2">
                    <Link to="/" className="flex items-center gap-2 mb-8 text-inherit no-underline">
                        {settings.site_logo ? (
                            <img src={settings.site_logo} alt={settings.site_name} className="h-10 w-auto object-contain" />
                        ) : (
                            <Sparkles className="text-rose-400 w-8 h-8" />
                        )}
                        <span className="text-3xl font-semibold italic serif">{settings.site_name || 'Dance House'}</span>
                    </Link>
                    <p className="text-slate-400 max-w-sm font-light leading-relaxed mb-8">
                        {t('hero_desc')}
                    </p>
                    <div className="flex gap-4">
                        {settings.facebook_url && (
                            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all cursor-pointer">FB</a>
                        )}
                        {settings.instagram_url && (
                            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all cursor-pointer">IG</a>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-rose-400">{t('discover')}</h4>
                    <ul className="space-y-4 text-sm text-slate-400 font-light">
                        <li><Link to="/programs" className="hover:text-white">{t('programs')}</Link></li>
                        <li><Link to="/instructors" className="hover:text-white">{t('instructors')}</Link></li>
                        <li><Link to="/facilities" className="hover:text-white">{t('facilities')}</Link></li>
                        <li><Link to="/news" className="hover:text-white">{t('news')}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-rose-400">{t('contact_info')}</h4>
                    <ul className="space-y-6 text-sm text-slate-400 font-light">
                        <li className="flex gap-3">
                            <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                            <span className="text-sm text-slate-400 whitespace-pre-line">{settings.contact_address || '123 Arabesque Ave\nBrooklyn, NY 11211'}</span>
                        </li>
                        <li className="flex gap-3">
                            <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                            <span className="text-sm text-slate-400">{settings.contact_email || 'hello@dancehouse.com'}</span>
                        </li>
                        <li className="flex gap-3">
                            <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                            <span className="text-sm text-slate-400">{settings.contact_phone || '+84 (0) 90 123 4567'}</span>
                        </li>
                        <li><Link to="/contact" className="text-rose-400 hover:text-white mt-2 block font-medium">{t('view_map')}</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <p>© {new Date().getFullYear()} {settings.site_name || 'Dance House Studio'}. All rights reserved.</p>
                <div className="flex gap-8">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
