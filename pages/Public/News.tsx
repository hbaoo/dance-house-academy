
import React, { useEffect, useState } from 'react';
import SimplePage from '../../components/SimplePage';
import { fetchPublicNews } from '../../services/newsService';
import { News as NewsType } from '../../types';
import { Loader2, Calendar, ArrowRight } from 'lucide-react';

const News: React.FC = () => {
    const [news, setNews] = useState<NewsType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPublicNews();
                setNews(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <SimplePage title="Tin tức & Sự kiện" subtitle="Nhịp đập Dance House">
            <div className="space-y-8 not-prose min-h-[400px]">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center text-slate-400 py-10">
                        Chưa có tin tức nào mới.
                    </div>
                ) : (
                    news.map((item) => (
                        <div key={item.id} className="group border-b border-slate-100 pb-8 last:border-0">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {item.image_url && (
                                    <div className="w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-2xl">
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <span className="flex items-center gap-2 text-rose-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(item.published_at).toLocaleDateString('vi-VN')}
                                    </span>
                                    <h3 className="text-2xl serif mb-3 font-bold text-slate-900 group-hover:text-rose-500 transition-colors cursor-pointer">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 font-light mb-4 line-clamp-2">
                                        {item.summary || 'Click để xem chi tiết...'}
                                    </p>
                                    <button className="text-xs font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Xem chi tiết <ArrowRight className="w-4 h-4 text-rose-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </SimplePage>
    );
};

export default News;
