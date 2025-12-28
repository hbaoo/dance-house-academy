import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Calendar, Award, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';

interface Package {
    id: string;
    name: string;
    description: string;
    duration_days: number | null;
    total_sessions: number;
    price: number;
    is_active: boolean;
    display_order: number;
}

const Packages: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [packages, setPackages] = useState<Package[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPackages();
    }, []);

    const loadPackages = async () => {
        try {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error) throw error;
            setPackages(data || []);
        } catch (error) {
            console.error('Failed to load packages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectPackage = (pkg: Package) => {
        navigate('/checkout', { state: { package: pkg } });
    };

    const features = [
        'Giáo viên chuyên nghiệp',
        'Phòng tập hiện đại',
        'Hỗ trợ 1-1 khi cần',
        'Chương trình cá nhân hóa',
        'Theo dõi tiến độ chi tiết'
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-rose-500 to-purple-600 text-white py-20">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                            <Sparkles className="w-10 h-10" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif mb-6">Chọn Gói Học Phí</h1>
                    <p className="text-xl text-rose-100 max-w-2xl mx-auto">
                        Bắt đầu hành trình ballet của bạn với các gói học linh hoạt,
                        phù hợp với mọi trình độ và nhu cầu
                    </p>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {packages.map((pkg, index) => {
                        const isPopular = index === 1; // Highlight the quarterly package

                        return (
                            <div
                                key={pkg.id}
                                className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${isPopular
                                        ? 'border-rose-500 shadow-xl'
                                        : 'border-slate-100 hover:border-rose-200'
                                    }`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                            Phổ biến nhất
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isPopular ? 'bg-rose-500' : 'bg-slate-100'
                                        }`}>
                                        <Award className={`w-8 h-8 ${isPopular ? 'text-white' : 'text-slate-400'}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                                    <p className="text-sm text-slate-500">{pkg.description}</p>
                                </div>

                                <div className="text-center mb-6 pb-6 border-b border-slate-100">
                                    <div className="text-4xl font-bold text-slate-900 mb-2">
                                        {(pkg.price / 1000000).toFixed(1)}M
                                    </div>
                                    <div className="text-sm text-slate-500">VNĐ</div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-600">{pkg.total_sessions} buổi học</span>
                                    </div>
                                    {pkg.duration_days && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                            <span className="text-slate-600">{pkg.duration_days} ngày</span>
                                        </div>
                                    )}
                                    {features.slice(0, 3).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-slate-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleSelectPackage(pkg)}
                                    className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isPopular
                                            ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                                            : 'bg-slate-900 text-white hover:bg-rose-500'
                                        }`}
                                >
                                    Chọn gói này
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-200">
                <h2 className="text-3xl font-serif text-center mb-12 text-slate-900">
                    Tại sao chọn Dance House?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="text-center p-6 bg-white rounded-2xl border border-slate-100">
                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Check className="w-6 h-6 text-rose-500" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">{feature}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Packages;
