
import React, { useEffect } from 'react';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

interface SimplePageProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const SimplePage: React.FC<SimplePageProps> = ({ title, subtitle, children }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <PublicNavbar />

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12 text-center">
                        <h1 className="text-5xl md:text-6xl serif mb-6">{title}</h1>
                        {subtitle && <p className="text-rose-500 font-bold uppercase tracking-widest text-xs">{subtitle}</p>}
                    </div>

                    <div className="prose prose-lg prose-slate mx-auto font-light">
                        {children}
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
};

export default SimplePage;
