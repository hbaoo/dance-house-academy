
import React from 'react';
import SimplePage from '../../components/SimplePage';

const News: React.FC = () => {
    return (
        <SimplePage title="Tin tức & Sự kiện" subtitle="Nhịp đập Dance House">
            <div className="space-y-8 not-prose">
                <div className="border-b border-slate-100 pb-8">
                    <span className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">20 Tháng 12, 2024</span>
                    <h3 className="text-2xl serif mt-2 mb-2 hover:text-rose-500 transition-colors cursor-pointer">Thông báo Lịch nghỉ Tết Nguyên Đán 2025</h3>
                    <p className="text-slate-500 font-light">Dance House xin thông báo lịch nghỉ tết chính thức từ ngày 22/01/2025 đến hết ngày 05/02/2025.</p>
                </div>

                <div className="border-b border-slate-100 pb-8">
                    <span className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">15 Tháng 11, 2024</span>
                    <h3 className="text-2xl serif mt-2 mb-2 hover:text-rose-500 transition-colors cursor-pointer">Gala "Giấc Mơ Thiên Nga" thành công rực rỡ</h3>
                    <p className="text-slate-500 font-light">Đêm diễn tổng kết cuối năm đã để lại nhiều cảm xúc khó quên cho hơn 500 khán giả tham dự.</p>
                </div>

                <div className="border-b border-slate-100 pb-8">
                    <span className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">01 Tháng 11, 2024</span>
                    <h3 className="text-2xl serif mt-2 mb-2 hover:text-rose-500 transition-colors cursor-pointer">Chào đón Chuyên gia Ballet từ Pháp</h3>
                    <p className="text-slate-500 font-light">Tháng này, chúng ta vinh dự được đón tiếp thầy Pierre đến từ Paris Opera Ballet workshop 2 tuần.</p>
                </div>
            </div>
        </SimplePage>
    );
};

export default News;
