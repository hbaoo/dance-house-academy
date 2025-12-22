
import React from 'react';
import SimplePage from '../../components/SimplePage';

const Instructors: React.FC = () => {
    return (
        <SimplePage title="Đội ngũ Giảng viên" subtitle="Những người truyền lửa đam mê">
            <div className="grid md:grid-cols-2 gap-8 not-prose">
                <div className="flex gap-4 items-start">
                    <img src="https://i.pravatar.cc/150?u=thu" className="w-24 h-24 rounded-full object-cover" alt="Minh Thu" />
                    <div>
                        <h3 className="text-xl serif font-bold">Cô Minh Thư</h3>
                        <p className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-2">Giám đốc chuyên môn</p>
                        <p className="text-slate-500 text-sm">Cựu diễn viên chính Nhà hát Nhạc Vũ Kịch Việt Nam. 15 năm kinh nghiệm giảng dạy Ballet cổ điển (Vaganova).</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <img src="https://i.pravatar.cc/150?u=nam" className="w-24 h-24 rounded-full object-cover" alt="Hoàng Nam" />
                    <div>
                        <h3 className="text-xl serif font-bold">Thầy Hoàng Nam</h3>
                        <p className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-2">Biên đạo múa</p>
                        <p className="text-slate-500 text-sm">Tốt nghiệp Học viện Múa Bắc Kinh. Chuyên gia về kỹ thuật Ballet đương đại và Pas de Deux.</p>
                    </div>
                </div>
            </div>
        </SimplePage>
    );
};

export default Instructors;
